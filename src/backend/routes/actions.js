const express = require('express');
const { actionManager } = require('../ActionManager');

const router = express.Router();

// Start a new action
router.post('/start', (req, res) => {
  const { actionType, inputId, additionalInput } = req.body;

  if (!actionType) {
    return res.status(400).json({ error: 'Missing actionType' });
  }

  try {
    const actionId = actionManager.startAction(actionType, inputId, additionalInput);
    res.json({ actionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start action' });
  }
});

// Stop a specific action
router.post('/stop/:id', (req, res) => {
  const { id } = req.params;
  try {
    actionManager.stopAction(id);
    res.json({ message: `Action ${id} stopped.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to stop action' });
  }
});

// Stop all actions
router.post('/stop-all', (req, res) => {
  try {
    actionManager.stopAllActions();
    res.json({ message: 'All actions stopped.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to stop all actions' });
  }
});

// Get live running actions
router.get('/live', (req, res) => {
  res.json({ live: actionManager.getLiveActions() });
});

// Get action history
router.get('/history', (req, res) => {
  res.json({ history: actionManager.getHistory() });
});

module.exports = router;
