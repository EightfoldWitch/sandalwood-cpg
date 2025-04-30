const EventEmitter = require('events');

class BaseAction extends EventEmitter {
  constructor() {
    super();
    this.actionId = null;
    this.inputId = null;
    this.additionalInput = null;
  }

  async initialize({ actionId, inputId, additionalInput }) {
    this.actionId = actionId;
    this.inputId = inputId;
    this.additionalInput = additionalInput;
  }

  emitStatus(status) {
    this.emit('status', status);
    if (this.onStatus) this.onStatus(status);
  }

  emitOutput(output) {
    this.emit('output', output);
    if (this.onOutput) this.onOutput(output);
  }

  // Must be implemented in subclasses
  async start() {
    throw new Error('start() must be implemented by subclass.');
  }
}

module.exports = BaseAction;