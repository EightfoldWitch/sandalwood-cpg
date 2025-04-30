import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { stopAction } from '../api';

function renderActionTree(actions) {
  return actions.map(action => (
    <TreeItem key={action.id} nodeId={action.id} label={
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{action.type} - {action.status}</span>
        <Button size="small" color="secondary" onClick={() => stopAction(action.id)}>Stop</Button>
      </div>
    }>
      {action.children && renderActionTree(action.children)}
    </TreeItem>
  ));
}

const ActionTree = ({ actions }) => {
  return (
    <div>
      <h2>Live Actions</h2>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderActionTree(actions)}
      </TreeView>
    </div>
  );
};

export default ActionTree;