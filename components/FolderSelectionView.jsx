// components/FolderSelectionView.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useThemeSettings } from '../pages/_app'; // ✅ Import useThemeSettings hook

const FolderSelectionView = ({ onFolderSelect }) => { // ✅ Expecting onFolderSelect prop
  const [selectedFolder, setSelectedFolder] = React.useState('');
  // const fileInputRef = React.useRef(null); // ❌ No longer needed - remove file input ref
  const { mode, toggleTheme } = useThemeSettings(); // ✅ Use the theme context

  const handleBrowseFolders = async () => { // ✅ Make handleBrowseFolders async
    console.log("[FolderSelectionView] handleBrowseFolders clicked"); // Log!
    try {
      const folderPath = await window.electronAPI.showOpenDialogForFolder(); // ✅ Call new preload function
      console.log("[FolderSelectionView] Selected folder path from dialog:", folderPath); // Log!
      if (folderPath) { // Check if a folder was actually selected (not canceled)
        setSelectedFolder(folderPath); // Update local state
        if (onFolderSelect) {
          onFolderSelect(folderPath); // ✅ Call onFolderSelect prop with FULL folderPath!
        }
      } else {
        console.log("[FolderSelectionView] No folder selected or dialog canceled.");
      }
    } catch (error) {
      console.error("Error showing open dialog or selecting folder:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        width: "100%",
        maxWidth: "800px",
        m: "0 auto",
      }}
    >
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        {/* <Typography variant="h4" component="h2" gutterBottom>
          Content Compendium
        </Typography> */}
        {/* <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Project Folder Selection
        </Typography> */}
      </Box>

      <Box sx={{ m: 2, textAlign: 'center' }}>
        <Button variant="contained" onClick={handleBrowseFolders}> {/* ✅ Now calls handleBrowseFolders */}
          Browse Folders...
        </Button>
      </Box>

      {/* --- Recent Folders Section (Optional for now) --- */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Folders: (Optional - Future Feature)
        </Typography>
        <Typography variant="body2" color="textSecondary">
          (Recent folders list will appear here in a future version)
        </Typography>
      </Box>
    </Container>
  );
};

export default FolderSelectionView;