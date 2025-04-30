const { Worker } = require('worker_threads');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');

// Load Socket.io instance
let ioInstance = null;
function setIo(io) {
  ioInstance = io;
}

class ActionManager {
  constructor() {
    this.actions = new Map(); // Map of actionId -> action metadata
    this.history = []; // Completed actions
  }

  startAction(actionType, inputId = null, additionalInput = {}) {
    const actionId = uuidv4();
    const worker = new Worker(path.join(__dirname, './runners/ActionRunner.js'), {
      workerData: {
        actionId,
        actionType,
        inputId,
        additionalInput
      }
    });

    const actionData = {
      id: actionId,
      type: actionType,
      status: 'running',
      startTime: new Date(),
      inputId,
      additionalInput,
      worker
    };

    this.actions.set(actionId, actionData);

    // Setup worker event listeners
    worker.on('message', (message) => {
      if (message.type === 'status') {
        this.updateStatus(actionId, message.status);
      } else if (message.type === 'output') {
        this.saveOutput(actionId, message.output);
      } else if (message.type === 'completed') {
        this.completeAction(actionId);
      }
    });

    worker.on('error', (error) => {
      console.error(`Error in action ${actionId}:`, error);
      this.failAction(actionId, error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        this.failAction(actionId, new Error(`Exit code ${code}`));
      }
    });

    // Notify clients
    this.broadcastUpdate();

    return actionId;
  }

  updateStatus(actionId, status) {
    const action = this.actions.get(actionId);
    if (action) {
      action.status = status;
      this.broadcastUpdate();
    }
  }

  completeAction(actionId) {
    const action = this.actions.get(actionId);
    if (action) {
      action.status = 'completed';
      action.endTime = new Date();
      this.history.push(action);
      this.actions.delete(actionId);
      this.broadcastUpdate();
    }
  }

  failAction(actionId, error) {
    const action = this.actions.get(actionId);
    if (action) {
      action.status = 'failed';
      action.endTime = new Date();
      action.error = error.message;
      this.history.push(action);
      this.actions.delete(actionId);
      this.broadcastUpdate();
    }
  }

  stopAction(actionId) {
    const action = this.actions.get(actionId);
    if (action && action.worker) {
      action.worker.terminate();
      action.status = 'stopped';
      action.endTime = new Date();
      this.history.push(action);
      this.actions.delete(actionId);
      this.broadcastUpdate();
    }
  }

  stopAllActions() {
    for (const actionId of this.actions.keys()) {
      this.stopAction(actionId);
    }
  }

  saveOutput(actionId, output) {
    const outputPath = path.join(__dirname, 'outputs', `${actionId}.json`);
    fs.outputJsonSync(outputPath, output);
  }

  getLiveActions() {
    return Array.from(this.actions.values()).map(({ worker, ...rest }) => rest);
  }

  getHistory() {
    return this.history;
  }

  broadcastUpdate() {
    if (ioInstance) {
      ioInstance.emit('actions_update', {
        live: this.getLiveActions(),
        history: this.getHistory()
      });
    }
  }
}

const actionManager = new ActionManager();

module.exports = {
  actionManager,
  setIo
};