// components/SettingsView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Typography, TextareaAutosize } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SettingsView = () => {
  const [ignoreSettings, setIgnoreSettings] = useState({ ignoredFolders: [], ignoredFiles: [] });
  const [folderInput, setFolderInput] = useState('');
  const [fileInput, setFileInput] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error' | 'warning' | 'info'

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.electronAPI.getIgnoreSettings();
        setIgnoreSettings(settings);
        // Convert arrays to comma-separated strings for input fields
        setFolderInput(settings.ignoredFolders.join(', '));
        setFileInput(settings.ignoredFiles.join(', '));
      } catch (error) {
        console.error("Error loading ignore settings:", error);
        showSnackbar('Error loading settings.', 'error');
      }
    };
    loadSettings();
  }, []);

  const handleFolderInputChange = (event) => {
    setFolderInput(event.target.value);
  };

  const handleFileInputChange = (event) => {
    setFileInput(event.target.value);
  };

  const parseInputToList = (inputString) => {
    return inputString.split(',').map(item => item.trim()).filter(item => item); // Split by comma, trim whitespace, remove empty entries
  };

  const handleSaveSettings = useCallback(async () => {
    try {
      const updatedSettings = {
        ignoredFolders: parseInputToList(folderInput),
        ignoredFiles: parseInputToList(fileInput)
      };
      await window.electronAPI.saveIgnoreSettings(updatedSettings);
      setIgnoreSettings(updatedSettings); // Update local state to reflect saved settings
      showSnackbar('Settings saved successfully!', 'success');
    } catch (error) {
      console.error("Error saving ignore settings:", error);
      showSnackbar('Error saving settings.', 'error');
    }
  }, [folderInput, fileInput]); // useCallback dependencies

  const handleResetDefaults = useCallback(async () => {
    try {
      await window.electronAPI.saveIgnoreSettings({ // Save DEFAULT_IGNORE_SETTINGS - re-get defaults from main if needed
        ignoredFolders: ['node_modules', '.git', '.next'],
        ignoredFiles: ['.DS_Store', 'Thumbs.db']
      });
      const defaultSettings = await window.electronAPI.getIgnoreSettings(); // Re-fetch defaults to ensure consistency
      setIgnoreSettings(defaultSettings);
      setFolderInput(defaultSettings.ignoredFolders.join(', '));
      setFileInput(defaultSettings.ignoredFiles.join(', '));
      showSnackbar('Settings reset to defaults.', 'success');
    } catch (error) {
      console.error("Error resetting to default settings:", error);
      showSnackbar('Error resetting settings.', 'error');
    }
  }, []);


  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Settings
      </Typography>

      <Typography variant="h6">Ignored Folders</Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Enter folder names to ignore, comma-separated"
        value={folderInput}
        onChange={handleFolderInputChange}
        aria-label="ignored-folders-input"
      />

      <Typography variant="h6">Ignored Files</Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Enter file names to ignore, comma-separated"
        value={fileInput}
        onChange={handleFileInputChange}
        aria-label="ignored-files-input"
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={handleResetDefaults}>Reset to Defaults</Button>
        <Button variant="contained" color="primary" onClick={handleSaveSettings}>Save Settings</Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default SettingsView;