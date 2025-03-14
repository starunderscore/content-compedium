// components/treesidebar/TreeViewWorkspaceSidebarToolbar.jsx
import React from 'react';
import { Toolbar, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

const TreeViewWorkspaceSidebarToolbar = ({ onOpenSettings, onOpenCreateWorkspaceModal }) => { // ✅ Add onOpenCreateWorkspaceModal prop
  const theme = useTheme();

  return (
    <Toolbar variant="dense" sx={{ p: "0 10px !important", justifyContent: 'space-between', bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <Typography variant="subtitle2" color="inherit" sx={{ mr: 1 }}>Workspaces</Typography>
      <IconButton color="inherit" aria-label="add workspace" sx={{ ml: 0 }} onClick={onOpenCreateWorkspaceModal}> {/* ✅ Attach onClick handler */}
        <AddIcon />
      </IconButton>
      <IconButton color="inherit" aria-label="refresh workspaces" sx={{ ml: 1 }}>
        <RefreshIcon />
      </IconButton>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton color="inherit" aria-label="settings" onClick={onOpenSettings}>
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  );
};

export default TreeViewWorkspaceSidebarToolbar;