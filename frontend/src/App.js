import React, { useEffect, useState } from 'react';
import socket from './socket';
import ActionTree from './components/ActionTree';
import ActionHistory from './components/ActionHistory';
import CommandInterface from './components/CommandInterface';
import { Container, Grid } from '@mui/material';

function App() {
  const [liveActions, setLiveActions] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);

  useEffect(() => {
    socket.on('actions_update', (data) => {
      setLiveActions(flattenActions(data.live));
      setActionHistory(data.history);
    });

    return () => socket.off('actions_update');
  }, []);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ActionTree actions={liveActions} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ActionHistory history={actionHistory} />
          <CommandInterface />
        </Grid>
      </Grid>
    </Container>
  );
}

// Helper: flatten parent/child into a proper tree
function flattenActions(actions) {
  const map = {};
  actions.forEach(action => {
    map[action.id] = { ...action, children: [] };
  });

  actions.forEach(action => {
    if (action.parentId && map[action.parentId]) {
      map[action.parentId].children.push(map[action.id]);
    }
  });

  return actions.filter(action => !action.parentId).map(action => map[action.id]);
}

export default App;