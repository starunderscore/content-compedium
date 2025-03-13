// components/TreeViewWorkspaceSidebar.jsx
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useTheme } from '@mui/material/styles';
import TreeViewWorkspaceItem from './TreeViewWorkspaceSiderbar/TreeViewWorkspaceItem';
import SettingsModal from './SettingsModal'; // Assuming SettingsModal is in the components directory
import TreeViewWorkspaceSidebarToolbar from './TreeViewWorkspaceSiderbar/TreeViewWorkspaceSiderbarToolbar';

const TreeViewWorkspaceSidebar = () => {
  const theme = useTheme();

  // --------------------------------------------------------
  // SECTION 1: Data - Workspace Tree Data (Placeholder)
  // --------------------------------------------------------
  const workspaceTreeData = [
    {
      name: "Workspace 1",
      type: 'workspace',
      visible: true,
      children: [
        {
          name: "Checkpoints",
          type: 'folder',
          children: [
            { name: "Checkpoint 1", type: 'file' },
            { name: "Checkpoint 2", type: 'file' },
          ],
        },
        {
          name: "Folders",
          type: 'folder',
          children: [
            {
              name: "Folder 1",
              type: 'folder',
              children: [
                { name: "file1.md", type: 'file' },
                { name: "file2.md", type: 'file' },
              ],
            },
            {
              name: "Folder 2",
              type: 'folder',
              children: [
                { name: "file3.md", type: 'file' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Workspace 2",
      type: 'workspace',
      visible: false,
      children: [
        { name: "Checkpoints", type: 'folder', },
        { name: "Folders", type: 'folder', },
      ],
    },
  ];

  // --------------------------------------------------------
  // SECTION 2: State Management
  // --------------------------------------------------------
  const [expandedItems, setExpandedItems] = React.useState(['Workspace 1']);
  const [workspaceTreeDataState, setWorkspaceTreeDataState] = React.useState(workspaceTreeData);
  const [workspaceMenuAnchorEl, setWorkspaceMenuAnchorEl] = React.useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  // --------------------------------------------------------
  // SECTION 3: Event Handlers
  // --------------------------------------------------------
  const handleItemClick = (itemName) => {
    setExpandedItems((prevExpanded) =>
      prevExpanded.includes(itemName)
        ? prevExpanded.filter((item) => item !== itemName)
        : [...prevExpanded, itemName]
    );
  };

  const handleVisibilityToggle = (workspaceName) => {
    setWorkspaceTreeDataState((prevData) =>
      prevData.map((workspace) =>
        workspace.name === workspaceName
          ? { ...workspace, visible: !workspace.visible }
          : workspace
      )
    );
    setExpandedItems((prevExpanded) => prevExpanded.filter((item) => item !== workspaceName));
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
  const renderTree = (items, level = 0, parentItem = null) => {
    return items.map((item) => (
      <TreeViewWorkspaceItem
        key={item.name}
        item={item}
        level={level}
        parentItem={parentItem}
        expandedItems={expandedItems}
        handleItemClick={handleItemClick}
        handleVisibilityToggle={handleVisibilityToggle}
        workspaceMenuAnchorEl={workspaceMenuAnchorEl}
        handleWorkspaceMenuOpen={handleWorkspaceMenuOpen}
        handleWorkspaceMenuClose={handleWorkspaceMenuClose}
        handleRemoveFolder={handleRemoveFolder}
        handleCheckAllInWorkspace={handleCheckAllInWorkspace}
        handleUncheckAllInWorkspace={handleUncheckAllInWorkspace}
      />
    ));
  };

  // --------------------------------------------------------
  // SECTION 5: JSX Structure - Component's Return Value
  // --------------------------------------------------------
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TreeViewWorkspaceSidebarToolbar onOpenSettings={handleOpenSettingsModal} />
      <List sx={{ flexGrow: 1, overflowY: 'auto' }} component="nav" aria-labelledby="workspace-tree-view">
        {renderTree(workspaceTreeDataState)}
      </List>
      <SettingsModal open={isSettingsModalOpen} onClose={handleCloseSettingsModal} />
    </Box>
  );
};

export default TreeViewWorkspaceSidebar;