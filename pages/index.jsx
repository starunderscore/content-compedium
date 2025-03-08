// pages/index.jsx (Updated to clear last folder path on back to home)
import React, { useState, useCallback, useEffect } from "react";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar/index"; // ✅ Correct import path for TopAppBar/index.jsx
import FolderSelectionView from "../components/FolderSelectionView";
import TreeMarkdownView from "../components/TreeMarkdownView";
import SettingsView from "../components/SettingsView"; // ✅ Import SettingsView

export default function HomePage() {
  const [selectedFolderPath, setSelectedFolderPath] = useState(null);
  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isSettingsViewActive, setIsSettingsViewActive] = useState(false); // ✅ State for Settings View


  const handleFolderSelect = useCallback((folderPath) => {
    console.log("[HomePage] handleFolderSelect CALLED with folderPath:", folderPath);
    setSelectedFolderPath(folderPath);
    setIsFolderSelected(true);
    setIsSettingsViewActive(false); // ✅ Deactivate Settings View when folder selected
    console.log("[HomePage] State updated - selectedFolderPath:", folderPath, "isFolderSelected:", isFolderSelected, "isSettingsViewActive:", isSettingsViewActive);
  }, []);


  useEffect(() => {
    const loadLastFolderPath = async () => {
      try {
        const lastFolderPath = await window.electronAPI.getLastFolderPath();
        if (lastFolderPath) {
          console.log("[HomePage] Loaded last folder path from storage:", lastFolderPath);
          handleFolderSelect(lastFolderPath);
        } else {
          console.log("[HomePage] No last folder path found in storage.");
          setIsFolderSelected(false);
        }
      } catch (error) {
        console.error("Error loading last folder path:", error);
        setIsFolderSelected(false);
      }
    };
    loadLastFolderPath();
  }, [handleFolderSelect]);


  const handleBackToFolderSelect = useCallback(() => {
    console.log("[HomePage] handleBackToFolderSelect CALLED");
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
    setIsSettingsViewActive(false); // ✅ Deactivate Settings View when going back to folder select
    window.electronAPI.clearLastFolderPath(); // ✅ CLEAR LAST FOLDER PATH HERE! - **[THIS IS THE FIX]**
    console.log("[HomePage] State updated - selectedFolderPath:", selectedFolderPath, "isFolderSelected:", isFolderSelected, "isSettingsViewActive:", isSettingsViewActive);
  }, []);

  const handleSettingsClick = useCallback(() => { // ✅ Handle Settings button click
    console.log("[HomePage] handleSettingsClick CALLED");
    setIsSettingsViewActive(true); // ✅ Activate Settings View
    setIsFolderSelected(false);     // ✅ Deactivate Folder/Tree View (if active)
    setSelectedFolderPath(null);    // ✅ Clear selected folder path
    console.log("[HomePage] State updated - isSettingsViewActive:", isSettingsViewActive, "isFolderSelected:", isFolderSelected, "selectedFolderPath:", selectedFolderPath);
  }, []);

  const handleBackToHomeFromSettings = useCallback(() => { // ✅ Handle back from Settings to Home (if needed later)
    console.log("[HomePage] handleBackToHomeFromSettings CALLED");
    setIsSettingsViewActive(false);   // ✅ Deactivate Settings View
    console.log("[HomePage] State updated - isSettingsViewActive:", isSettingsViewActive);
  }, []);


  return (
    <Layout>
      <TopAppBar
        onSettingsClick={handleSettingsClick} // ✅ Pass handleSettingsClick to TopAppBar
        onBackToHome={isFolderSelected || isSettingsViewActive ? handleBackToFolderSelect : null} // Conditionally show back button
      />

      {isSettingsViewActive ? ( // ✅ Render SettingsView if active
        <SettingsView />
      ) : !isFolderSelected ? (
        <FolderSelectionView onFolderSelect={handleFolderSelect} />
      ) : (
        <TreeMarkdownView folderPath={selectedFolderPath} onBack={handleBackToFolderSelect} />
      )}
    </Layout>
  );
}