// components/TreeMarkdownView.jsx (Corrected - fetchTree with useCallback)
// blah
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'; // ✅ Use TreeItem2
import MarkdownContentView from './MarkdownContentView';
import FolderIcon from '@mui/icons-material/Folder';

const TreeMarkdownView = ({ folderPath, onBack }) => {
  const [treeData, setTreeData] = useState(null);
  const [selectedFilesContent, setSelectedFilesContent] = useState([]); // ✅ State for array of file contents
  // const [selectedNode, setSelectedNode] = useState(null); // ✅ Removed selectedNode state - not needed for multi-select

  // ✅ Define fetchTree using useCallback - OUTSIDE the useEffect
  const fetchTree = useCallback(async () => {
    try {
      if (!folderPath) return;

      console.log("[Renderer] Requesting folder tree for:", folderPath);
      const data = await window.electronAPI.getFolderTree(folderPath);
      console.log("[Renderer] Received folder tree data:", data);
      setTreeData(data);
    } catch (error) {
      console.error("Failed to fetch folder tree:", error);
    }
  }, [folderPath]); // ✅ Dependency array for useCallback - include folderPath

  useEffect(() => {
    fetchTree(); // ✅ Call fetchTree here - it's now defined outside

    // ✅ Setup IPC listener for 'file-changed' event
    const handleFileChange = async (event, fileChangeEvent) => {
      console.log("[Renderer] Received file-changed event:", fileChangeEvent);
      const { eventType, filePath } = fileChangeEvent;

      if (eventType === 'change') { // Only handle 'change' events for now
        console.log(`[Renderer] File changed, refreshing content: ${filePath}`);
        try {
          const updatedContent = await window.electronAPI.getFileContent(filePath); // Re-fetch content
          console.log("[Renderer] Refreshed content for:", filePath);

          // ✅ Update selectedFilesContent to reflect the changed file content
          setSelectedFilesContent(prevFilesContent => {
            return prevFilesContent.map(fileData => {
              if (fileData.filePath === filePath) {
                return { ...fileData, content: updatedContent }; // Update content for changed file
              }
              return fileData; // Keep other file data unchanged
            });
          });
          console.log("[Renderer] selectedFilesContent updated with refreshed file.");

        } catch (error) {
          console.error("[Renderer] Error refreshing file content:", error);
        }
      } else if (eventType === 'add') {
        console.log(`[Renderer] File added: ${filePath} - You might want to refresh the tree or handle addition.`);
        // Optionally refresh the folder tree here if you want newly added files to appear immediately
        fetchTree(); // Re-fetch the tree to include new files (simplest approach for now)

      } else if (eventType === 'unlink') {
        console.log(`[Renderer] File removed: ${filePath} - You might want to refresh the tree or handle removal.`);
        // Optionally refresh the folder tree and/or remove content if it was being displayed
        fetchTree(); // Re-fetch the tree to update file list (simplest for now)
        setSelectedFilesContent(prevFilesContent => // Remove content of deleted file if it was selected
          prevFilesContent.filter(fileData => fileData.filePath !== filePath)
        );
      }
    };

    window.electronAPI.on('file-changed', handleFileChange); // ✅ Register IPC listener

    return () => {
      window.electronAPI.off('file-changed', handleFileChange); // ✅ Unregister listener on component unmount
    };


  }, [folderPath, setSelectedFilesContent, fetchTree]); // ✅ useEffect dependency array NOW includes fetchTree

  const renderTree = (nodes) => {
    console.log("[renderTree] Node Name:", nodes.name, " - Node Type:", nodes.type);

    return (
      <TreeItem2 // ✅ Use TreeItem2
        key={nodes.id}
        itemId={nodes.id}
        label={nodes.name}
        slots={{
          checkbox: nodes.type === 'file' ? undefined : () => { return <div /> },
          // icon: nodes.type === 'folder' ? FolderIcon : undefined, // Optional folder icons
        }}
      >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem2>
    );
  };

  const handleNodeSelect = useCallback(async (event, nodeIds) => { // ✅ nodeIds is array from onSelectionModelChange
    console.log("handleNodeSelect START");
    console.log("[TreeMarkdownView] Selected Node IDs (from onSelectionModelChange):", nodeIds);

    if (!treeData) {
      console.log("handleNodeSelect: treeData is NOT loaded yet. Exiting.");
      return;
    }

    if (!nodeIds || nodeIds.length === 0) {
      console.log("handleNodeSelect: No checkboxes selected. Clearing content.");
      setSelectedFilesContent([]); // Clear selectedFilesContent when no checkboxes are selected
      return;
    }

    const selectedFilesData = []; // Array to store data for selected files

    for (const nodeId of nodeIds) { // Iterate through all selected nodeIds
      const selectedNode = findNodeById(treeData, nodeId);
      if (selectedNode && selectedNode.type === 'file') { // Process only file nodes
        try {
          const content = await window.electronAPI.getFileContent(selectedNode.filePath);
          selectedFilesData.push({ // Store filePath and content for each file
            filePath: selectedNode.filePath,
            content: content,
          });
        } catch (error) {
          console.error("handleNodeSelect: Error fetching file content for:", selectedNode.filePath, error);
        }
      }
    }

    setSelectedFilesContent(selectedFilesData); // Update state with array of selected file content
    console.log("handleNodeSelect: selectedFilesContent updated:", selectedFilesContent); // Log updated state

    console.log("handleNodeSelect END");

  }, [treeData]);

  const findNodeById = (nodes, nodeId) => {
    if (nodes.id === nodeId) {
      return nodes;
    }
    if (nodes.children) {
      for (const child of nodes.children) {
        const foundNode = findNodeById(child, nodeId);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };

  return (
    <Container
      sx={{
        width: "100%",
        m: "0 auto",
        mt: 4,
        p: 0,
      }}>
      <Box sx={{ display: 'flex', flexDirection: "row" }}>

        <TreeView
          checkboxSelection={true}
          multiSelect={true}
          aria-label="file system navigator"
          defaultCollapseIcon="> "
          defaultExpandIcon="▽"
          defaultSelected={[]}
          // onSelectionModelChange={handleNodeSelect}
          onSelectedItemsChange={handleNodeSelect}
          sx={{ flexGrow: 1, maxWidth: 400, marginRight: 3 }}
        >
          {/* <Button variant="outlined" onClick={onBack} sx={{ mb: 3 }}>
						&lt;-- Back
					</Button>
					<br /> */}
          {treeData ? renderTree(treeData) : null}
        </TreeView>

        <MarkdownContentView
          filesContent={selectedFilesContent} // ✅ Pass filesContent array to MarkdownContentView
          filePath={null} // ✅ filePath prop is no longer used in multi-select mode
        />
      </Box>
    </Container>
  );
};

export default TreeMarkdownView