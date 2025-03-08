// components/FolderSelectionView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import path from 'path'

const FolderSelectionView = ({ onFolderSelect }) => {
  const [recentFolders, setRecentFolders] = useState([]);

  useEffect(() => {
    const loadRecentFolders = async () => {
      try {
        const folders = await window.electronAPI.getRecentFolders();
        setRecentFolders(folders);
      } catch (error) {
        console.error("Failed to load recent folders:", error);
      }
    };
    loadRecentFolders();
  }, []);

  const handleBrowseFolder = useCallback(async () => {
    console.log("[FolderSelectionView] handleBrowseFolder CALLED");
    try {
      const folderPath = await window.electronAPI.showOpenDialogForFolder();
      if (folderPath) {
        onFolderSelect(folderPath); // ✅ Propagate folder path to HomePage
        window.electronAPI.addRecentFolder(folderPath); // ✅ Add to recent folders on browse
        window.electronAPI.saveLastFolderPath(folderPath); // ✅ SAVE LAST FOLDER PATH HERE on "Browse Folders..."
      }
    } catch (error) {
      console.error("Error in handleBrowseFolder:", error);
    }
  }, [onFolderSelect]);


  const handleRecentFolderSelect = useCallback((folderPath) => { // ✅ Handle recent folder selection
    console.log("[FolderSelectionView] handleRecentFolderSelect CALLED with:", folderPath);
    onFolderSelect(folderPath); // ✅ Propagate folder path to HomePage - ALREADY PRESENT
    window.electronAPI.addRecentFolder(folderPath); // ✅ Move to top in recent folders - ALREADY PRESENT
    window.electronAPI.saveLastFolderPath(folderPath); // ✅ SAVE LAST FOLDER PATH HERE also on recent folder select! - **[THIS IS THE FIX]**
  }, [onFolderSelect]);


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Select a Project Folder
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBrowseFolder}>
          Browse Folders...
        </Button>

        {recentFolders.length > 0 && (
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Recent Folders
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {recentFolders.map((folderPath) => (
                <Grid item key={folderPath} xs={12} sm={6} md={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleRecentFolderSelect(folderPath)} // ✅ Use handleRecentFolderSelect
                  >
                    {path.basename(folderPath)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FolderSelectionView;