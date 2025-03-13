// pages/index.jsx (Refined Layout - Theme Consistency & Polish)
import React, { useState, useCallback, useEffect } from "react";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar/index";
import FolderSelectionView from "../components/FolderSelectionView";
import TreeMarkdownView from "../components/TreeMarkdownView";
import SettingsView from "../components/SettingsView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import ContentViewTabs from "../components/ContentViewTabs";
import TreeViewWorkspaceSidebar from "../components/TreeViewWorkspaceSiderbar";

export default function HomePage() {
  const theme = useTheme(); // ✅ Get the theme object

  const [selectedFolderPath, setSelectedFolderPath] = useState(null);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isSettingsViewActive, setIsSettingsViewActive] = useState(false);

  const handleFolderSelect = useCallback((folderPath) => {
    setSelectedFolderPath(folderPath);
    setIsFolderSelected(true);
    setIsSettingsViewActive(false);
  }, []);

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
  }, [handleFolderSelect]);

  const handleBackToFolderSelect = useCallback(() => {
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
    setIsSettingsViewActive(false);
    window.electronAPI.clearLastFolderPath();
  }, []);

  const handleSettingsClick = useCallback(() => {
    setIsSettingsViewActive(true);
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
  }, []);

  const handleBackToHomeFromSettings = useCallback(() => {
    setIsSettingsViewActive(false);
  }, []);

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
          bgcolor: theme.palette.background.paper,        // ✅ Theme-aware background for 'paper' surfaces
          color: theme.palette.text.primary,             // ✅ Theme-aware primary text color
          overflowY: 'auto',                              // ✅ Add scroll if sidebar content overflows
        }}>
          <TreeViewWorkspaceSidebar /> {/* ✅ Integrate WorkspaceSidebar component */}
        </Box>

        {/* --- Right Content View (Tabs) - REFINED STYLING --- */}
        <Box sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,      // ✅ Theme-aware default background
          color: theme.palette.text.primary,             // ✅ Theme-aware primary text color
          edisplay: 'flex',                               // ✅ Use Flexbox for vertical centering
          flexDirection: 'column',                        // ✅ Stack content vertically
          alignItems: 'center',                           // ✅ Center content horizontally
          justifyContent: 'flex-start',                  // ✅ Align content to the top in content area
          overflowY: 'auto',                              // ✅ Add scroll if content overflows
        }}>
          <ContentViewTabs /> {/* ✅ Integrate ContentViewTabs component */}

          {/* Content View Tabs and Content will go here */}
          {!isFolderSelected && !isSettingsViewActive && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="subtitle1" color="textSecondary"> {/* ✅ Use 'textSecondary' for softer welcome text */}
                Welcome! Create or Open a Workspace to begin.
              </Typography>
              {/* Buttons for Create/Open Workspace will go here - ADD THESE NEXT */}
            </Box>
          )}
          {isSettingsViewActive && (
            <SettingsView />
          )}
          {isFolderSelected && (
            <TreeMarkdownView folderPath={selectedFolderPath} onBack={handleBackToFolderSelect} />
          )}
        </Box>

      </Box>
      {/* --- END MAIN CONTENT AREA --- */}

    </Layout>
  );
}