import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';

const ActionHistory = ({ history }) => {
  return (
    <div>
      <h2>Action History</h2>
      <List>
        {history.map(action => (
          <div key={action.id}>
            <ListItem>
              <ListItemText
                primary={`${action.type} - Started: ${new Date(action.startTime).toLocaleString()}`}
                secondary={`Completed: ${new Date(action.endTime).toLocaleString()} | Output: ${action.outputId || 'N/A'}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default ActionHistory;