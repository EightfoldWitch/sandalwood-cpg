const { parentPort, workerData } = require('worker_threads');
const path = require('path');

// Import specific Action class dynamically
async function loadActionClass(actionType) {
  const modulePath = path.join(__dirname, '..', 'actions', `${actionType}.js`);
  const ActionClass = require(modulePath);
  return new ActionClass();
}

(async () => {
  const { actionId, actionType, inputId, additionalInput } = workerData;

  try {
    const actionInstance = await loadActionClass(actionType);
    await actionInstance.initialize({ actionId, inputId, additionalInput });

    // Start the action
    actionInstance.onStatus = (status) => {
      parentPort.postMessage({ type: 'status', status });
    };

    actionInstance.onOutput = (output) => {
      parentPort.postMessage({ type: 'output', output });
    };

    await actionInstance.start();

    parentPort.postMessage({ type: 'completed' });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();