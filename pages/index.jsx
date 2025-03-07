// pages/index.jsx
import React, { useState, useCallback } from "react";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar";
import FolderSelectionView from "../components/FolderSelectionView";
import TreeMarkdownView from "../components/TreeMarkdownView";

export default function HomePage() {
  const [selectedFolderPath, setSelectedFolderPath] = useState(null);
  const [isFolderSelected, setIsFolderSelected] = useState(false);

  const handleFolderSelect = useCallback((folderPath) => {
    console.log("[HomePage] handleFolderSelect CALLED with folderPath:", folderPath); // ✅ ADD THIS LOG
    setSelectedFolderPath(folderPath);
    setIsFolderSelected(true);
    console.log("[HomePage] State updated - selectedFolderPath:", folderPath, "isFolderSelected:", isFolderSelected); // ✅ ADD THIS LOG - check state AFTER update
  }, []);

  const handleBackToFolderSelect = useCallback(() => {
    console.log("ENTERING handleFolderSelect in pages/index.jsx"); // ⭐️⭐️⭐️ ADD THIS LOG - VERY IMPORTANT
    console.log("[HomePage] handleBackToFolderSelect CALLED"); // ✅ ADD THIS LOG
    setIsFolderSelected(false);
    setSelectedFolderPath(null);
    console.log("[HomePage] State updated - selectedFolderPath:", selectedFolderPath, "isFolderSelected:", isFolderSelected); // ✅ ADD THIS LOG - check state AFTER update
  }, []);


  return (
    <Layout>
      <TopAppBar />

      {!isFolderSelected ? (
        <FolderSelectionView onFolderSelect={handleFolderSelect} />
      ) : (
        <TreeMarkdownView folderPath={selectedFolderPath} onBack={handleBackToFolderSelect} />
      )}
    </Layout>
  );
}