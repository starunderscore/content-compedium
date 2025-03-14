// components/SettingsModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const SettingsModal = ({ open, onClose }) => {
  const [ignoredFolders, setIgnoredFolders] = useState(['node_modules', '.git']); // Example initial values
  const [newIgnoredFolder, setNewIgnoredFolder] = useState('');
  const [ignoredFiles, setIgnoredFiles] = useState(['.DS_Store']); // Example initial values
  const [newIgnoredFile, setNewIgnoredFile] = useState('');
  const [wordsPerPage, setWordsPerPage] = useState(500); // Example initial value

  const handleAddIgnoredFolder = () => {
    if (newIgnoredFolder.trim()) {
      setIgnoredFolders([...ignoredFolders, newIgnoredFolder.trim()]);
      setNewIgnoredFolder('');
    }
  };

  const handleDeleteIgnoredFolder = (index) => {
    const updatedFolders = [...ignoredFolders];
    updatedFolders.splice(index, 1);
    setIgnoredFolders(updatedFolders);
  };

  const handleAddIgnoredFile = () => {
    if (newIgnoredFile.trim()) {
      setIgnoredFiles([...ignoredFiles, newIgnoredFile.trim()]);
      setNewIgnoredFile('');
    }
  };

  const handleDeleteIgnoredFile = (index) => {
    const updatedFiles = [...ignoredFiles];
    updatedFiles.splice(index, 1);
    setIgnoredFiles(updatedFiles);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="settings-modal-title"
      aria-describedby="settings-modal-description"
    >
      <Box sx={style}>
        <Typography id="settings-modal-title" variant="h6" component="h2" sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Settings
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Typography>

        <Typography variant="subtitle1" gutterBottom>Ignored Folders</Typography>
        <List dense>
          {ignoredFolders.map((folder, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteIgnoredFolder(index)} size="small">
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={folder} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Add Folder to Ignore"
            value={newIgnoredFolder}
            onChange={(e) => setNewIgnoredFolder(e.target.value)}
            size="small"
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <IconButton aria-label="add" onClick={handleAddIgnoredFolder} size="small">
            <AddIcon />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" gutterBottom>Ignored Files</Typography>
        <List dense>
          {ignoredFiles.map((file, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteIgnoredFile(index)} size="small">
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Add File to Ignore"
            value={newIgnoredFile}
            onChange={(e) => setNewIgnoredFile(e.target.value)}
            size="small"
            sx={{ mr: 1, flexGrow: 1 }}
          />
          <IconButton aria-label="add" onClick={handleAddIgnoredFile} size="small">
            <AddIcon />
          </IconButton>
        </Box>

        <TextField
          label="Words Per Page/Tab"
          type="number"
          value={wordsPerPage}
          onChange={(e) => setWordsPerPage(parseInt(e.target.value, 10))}
          size="small"
          sx={{ mb: 2, width: '100%' }}
        />

        {/* You can add more settings UI elements here */}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onClose}>Save</Button> {/* Placeholder save action */}
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;