// components/WorkspaceSidebar.jsx (Dynamic Workspace List & Create - Placeholder)
import React, { useState } from 'react'; // ✅ Import useState
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const WorkspaceSidebar = () => {
  // ✅ 1. Use useState for dynamic workspaceList
  const [workspaceList, setWorkspaceList] = useState([
    'Code Projects',
    'Writing Projects',
    'Personal Notes',
    'Research Documents',
    'Client Work',
  ]);

  // ✅ 2. Function to handle "Create New Workspace" button click
  const handleCreateWorkspace = () => {
    const newWorkspaceName = prompt("Enter new workspace name:"); // Simple prompt for now
    if (newWorkspaceName && newWorkspaceName.trim() !== "") {
      // If user entered a name and didn't cancel
      setWorkspaceList([...workspaceList, newWorkspaceName.trim()]); // Add to workspace list state
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* --- BRANDING - "Content Compendium" TITLE --- */}
      <Typography variant="h5" color="inherit" component="div" sx={{
        p: 2,
        fontWeight: 'bold',
        bgcolor: 'grey.700',
      }}>
        Content Compendium
      </Typography>

      {/* --- Sidebar Heading --- */}
      <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
        Workspaces
      </Typography>

      {/* --- Buttons (Create & Open) --- */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" size="small" fullWidth onClick={handleCreateWorkspace}> {/* ✅ Connect to handleCreateWorkspace */}
          Create New Workspace
        </Button>
        <Button variant="outlined" size="small" fullWidth>
          Open Workspace
        </Button>
      </Box>

      <Divider /> {/* Separator line */}

      {/* --- Workspace List --- */}
      <List component="nav" aria-label="workspace folders" sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {workspaceList.map((workspaceName, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemText primary={workspaceName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WorkspaceSidebar;