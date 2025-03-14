// pages/index.jsx (Refined Layout - Theme Consistency & Polish - with Folder Selection and Workspace Modal)
import React, { useState, useCallback, useEffect } from "react";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar/index";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import ContentViewTabs from "../components/ContentViewTabs";
import Button from "@mui/material/Button"; // Import Button
import AddIcon from '@mui/icons-material/Add'; // Import the plus icon
import CreateWorkspaceModal from "../components/Modals/CreateWorkspaceModal";
import TreeViewWorkspaceSidebar from "../components/TreeViewWorkspaceSidebar";

export default function HomePage() {
  const theme = useTheme(); // ✅ Get the theme object

  const [selectedFolderPath, setSelectedFolderPath] = useState(null);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isSettingsViewActive, setIsSettingsViewActive] = useState(false);
  const [workspaceTreeData, setWorkspaceTreeData] = useState(null); // State for dynamic tree data
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false); // State for modal visibility
  const [workspaces, setWorkspaces] = useState(); // ✅ Initialize with an empty array

  const loadWorkspaces = useCallback(async () => {
    try {
      const loadedWorkspaces = await window.electronAPI.getWorkspaces();
      setWorkspaces(loadedWorkspaces || []);
    } catch (error) {
      console.error("Error loading workspaces:", error);
      // Handle error appropriately (e.g., display a message to the user)
    }
  },);

  const handleFolderSelect = useCallback(async (folderPath) => {
    setSelectedFolderPath(folderPath);
    setIsFolderSelected(true);
    setIsSettingsViewActive(false);
    try {
      const treeData = await window.electronAPI.getWorkspaceTree(folderPath);
      setWorkspaceTreeData(treeData);
    } catch (error) {
      console.error("Error fetching workspace tree:", error);
      // Handle error appropriately (e.g., display a message to the user)
    }
  },);

  const handleOpenFolderDialog = useCallback(async () => {
    const result = await window.electronAPI.showOpenDialog();
    if (result && result.filePaths && result.filePaths.length > 0) {
      handleFolderSelect(result.filePaths[0]);
      window.electronAPI.saveLastFolderPath(result.filePaths[0]);
    }
  }, [handleFolderSelect]);

  useEffect(() => {
    const loadLastFolderPath = async () => {
      try {
        const lastFolderPath = await window.electronAPI.getLastFolderPath();
        if (lastFolderPath) {
          handleFolderSelect(lastFolderPath);
        } else {
          setIsFolderSelected(false);
        }
      } catch (error) {
        setIsFolderSelected(false);
      }
    };
    loadLastFolderPath();
    loadWorkspaces(); // Load workspaces on component mount
  }, [handleFolderSelect, loadWorkspaces]); // Added loadWorkspaces to dependency array

  const handleBackToFolderSelect = useCallback(() => {
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
    setIsSettingsViewActive(false);
    setWorkspaceTreeData(null); // Clear tree data
    window.electronAPI.clearLastFolderPath();
  },);

  const handleSettingsClick = useCallback(() => {
    setIsSettingsViewActive(true);
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
    setWorkspaceTreeData(null); // Clear tree data
  },);

  const handleBackToHomeFromSettings = useCallback(() => {
    setIsSettingsViewActive(false);
  },);

  const handleOpenCreateWorkspaceModal = useCallback(() => {
    setIsCreateWorkspaceModalOpen(true);
  },);

  const handleCloseCreateWorkspaceModal = useCallback(() => {
    setIsCreateWorkspaceModalOpen(false);
    loadWorkspaces(); // Reload workspaces after closing the modal
  }, [loadWorkspaces]);

  const handleCreateNewWorkspace = useCallback(async (workspaceName) => {
    try {
      const newWorkspace = await window.electronAPI.createWorkspace(workspaceName);
      console.log("Workspace created:", newWorkspace);
      // The loadWorkspaces function will handle updating the UI
    } catch (error) {
      console.error("Error creating workspace:", error);
      // Handle error appropriately
    }
  }, [loadWorkspaces]);

  return (
    <Layout>
      <TopAppBar
        onSettingsClick={handleSettingsClick}
        onBackToHome={isFolderSelected || isSettingsViewActive ? handleBackToFolderSelect : null}
      />

      {/* --- MAIN CONTENT AREA - Version 8 Layout - REFINED STYLING --- */}
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px - 50px)' }}>

        {/* --- Left Sidebar (Workspace & Content) - REFINED STYLING --- */}
        <Box sx={{
          width: 300,
          borderRight: `1px solid ${theme.palette.divider}`, // ✅ Theme-aware divider
          bgcolor: theme.palette.background.paper,          // ✅ Theme-aware background for 'paper' surfaces
          color: theme.palette.text.primary,              // ✅ Theme-aware primary text color
          overflowY: 'auto',                               // ✅ Add scroll if sidebar content overflows
        }}>
          <TreeViewWorkspaceSidebar
            treeData={workspaceTreeData}
            onOpenSettings={handleSettingsClick}
            onOpenCreateWorkspaceModal={handleOpenCreateWorkspaceModal}
            workspaces={workspaces} // Pass the workspaces to the sidebar
          /> {/* ✅ Pass the prop */}
        </Box>

        {/* --- Right Content View (Tabs) - REFINED STYLING --- */}
        <Box sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,        // ✅ Theme-aware default background
          color: theme.palette.text.primary,              // ✅ Theme-aware primary text color
          display: 'flex',                                // ✅ Use Flexbox for vertical centering
          flexDirection: 'column',                        // ✅ Stack content vertically
          alignItems: 'center',                           // ✅ Center content horizontally
          justifyContent: 'flex-start',                   // ✅ Align content to the top in content area
          overflowY: 'auto',                               // ✅ Add scroll if content overflows
        }}>
          <ContentViewTabs /> {/* ✅ Integrate ContentViewTabs component */}

          {/* Content View Tabs and Content will go here */}
          {!isFolderSelected && !isSettingsViewActive && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="textSecondary"> {/* ✅ Use 'textSecondary' for softer welcome text */}
                Welcome! Create or Open a Workspace to begin.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenFolderDialog}
                sx={{ mt: 2 }}
              >
                Open Workspace
              </Button>
              {/* The Create Workspace button is now in the toolbar */}
            </Box>
          )}
        </Box>

      </Box>
      {/* --- END MAIN CONTENT AREA --- */}

      <CreateWorkspaceModal
        open={isCreateWorkspaceModalOpen}
        onClose={handleCloseCreateWorkspaceModal}
        onCreate={handleCreateNewWorkspace}
      />
    </Layout>
  );
}