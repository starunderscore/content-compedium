// components/TreeViewWorkspaceSidebar.jsx
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import TreeViewWorkspaceItem from './TreeViewWorkspaceSidebar/TreeViewWorkspaceItem';
import TreeViewWorkspaceSidebarToolbar from './TreeViewWorkspaceSidebar/TreeViewWorkspaceSidebarToolbar';
import SettingsModal from './Modals/SettingsModal';
import Typography from '@mui/material/Typography'; // Import Typography

const TreeViewWorkspaceSidebar = ({ onOpenCreateWorkspaceModal, onOpenSettings, workspaces }) => { // ✅ Receive workspaces prop
  const theme = useTheme();

  // --------------------------------------------------------
  // SECTION 2: State Management
  // --------------------------------------------------------
  const [expandedItems, setExpandedItems] = React.useState([]); // Initialize as an empty array
  const [workspaceMenuAnchorEl, setWorkspaceMenuAnchorEl] = React.useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  // --------------------------------------------------------
  // SECTION 3: Event Handlers
  // --------------------------------------------------------
  const handleItemClick = (itemId) => { // Changed to itemId
    setExpandedItems((prevExpanded) => {
      const isCurrentlyExpanded = prevExpanded.includes(itemId);
      const updatedExpandedItems = isCurrentlyExpanded
        ? prevExpanded.filter((item) => item !== itemId)
        : [...prevExpanded, itemId];

      // If expanding a workspace, also expand its direct children (Checkpoints and Folders)
      const workspace = workspaces.find(ws => ws.id === itemId && ws.type === 'workspace');
      if (workspace && !isCurrentlyExpanded) {
        updatedExpandedItems.push(`${workspace.id}-checkpoints`);
        updatedExpandedItems.push(`${workspace.id}-folders`);
      }
      // If collapsing a workspace, also collapse its direct children
      else if (workspace && isCurrentlyExpanded) {
        return updatedExpandedItems.filter(item => item !== `${workspace.id}-checkpoints` && item !== `${workspace.id}-folders`);
      }

      return updatedExpandedItems;
    });
  };

  const handleVisibilityToggle = (workspaceId, visible) => {
    // Implement backend call to update visibility
    console.log(`Toggle visibility for workspace ${workspaceId} to ${visible}`);
  };

  const handleWorkspaceMenuOpen = (event) => {
    setWorkspaceMenuAnchorEl(event.currentTarget);
  };

  const handleWorkspaceMenuClose = () => {
    setWorkspaceMenuAnchorEl(null);
  };

  const handleRemoveFolder = (folderName) => {
    console.log("Remove Folder Clicked for:", folderName);
    // Implement remove folder logic later
  };

  const handleCheckAllInWorkspace = (workspaceName) => {
    console.log("Check Everything Clicked for:", workspaceName);
    handleWorkspaceMenuClose();
    // Implement check all logic later
  };

  const handleUncheckAllInWorkspace = (workspaceName) => {
    console.log("Uncheck Everything Clicked for:", workspaceName);
    handleWorkspaceMenuClose();
    // Implement uncheck all logic later
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  // --------------------------------------------------------
  // SECTION 4: Rendering
  // --------------------------------------------------------
  const renderWorkspaces = () => {
    return (
      <>
        {(!workspaces || workspaces.length === 0) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <Typography variant="subtitle2" color="textSecondary">
              No workspaces created yet.
            </Typography>
          </Box>
        )}
        {workspaces && workspaces.length > 0 && workspaces.map((workspace) => ({
          ...workspace,
          type: 'workspace',
          children: [
            { id: `${workspace.id}-checkpoints`, name: 'Checkpoints', type: 'folder', children: workspace.checkpoints },
            { id: `${workspace.id}-folders`, name: 'Folders', type: 'folder', children: workspace.folders },
          ],
        })).map((workspaceWithChildren) => (
          <TreeViewWorkspaceItem
            key={workspaceWithChildren.id}
            item={workspaceWithChildren}
            level={0}
            expandedItems={expandedItems}
            handleItemClick={handleItemClick}
            handleVisibilityToggle={(id, visible) => handleVisibilityToggle(id, visible)} // Adjust for workspace ID
            workspaceMenuAnchorEl={workspaceMenuAnchorEl}
            handleWorkspaceMenuOpen={handleWorkspaceMenuOpen}
            handleWorkspaceMenuClose={handleWorkspaceMenuClose}
            // These handlers might not be relevant at the workspace level
            handleRemoveFolder={() => { }}
            handleCheckAllInWorkspace={() => { }}
            handleUncheckAllInWorkspace={() => { }}
          />
        ))}
      </>
    );
  };

  // --------------------------------------------------------
  // SECTION 5: JSX Structure - Component's Return Value
  // --------------------------------------------------------
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TreeViewWorkspaceSidebarToolbar
        onOpenCreateWorkspaceModal={onOpenCreateWorkspaceModal}
        onOpenSettings={handleOpenSettingsModal}
      />
      <List sx={{ flexGrow: 1, overflowY: 'auto' }} component="nav" aria-labelledby="workspace-tree-view">
        {renderWorkspaces()} {/* Render the workspaces */}
      </List>
      <SettingsModal open={isSettingsModalOpen} onClose={handleCloseSettingsModal} />
    </Box>
  );
};

export default TreeViewWorkspaceSidebar;