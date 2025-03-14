// components/CreateWorkspaceModal.jsx
import React, { useState, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CreateWorkspaceModal = ({ open, onClose, onCreate }) => {
  const [workspaceName, setWorkspaceName] = useState('');

  const handleInputChange = useCallback((event) => {
    setWorkspaceName(event.target.value);
  },);

  const handleCreate = useCallback(() => {
    if (workspaceName.trim()) {
      onCreate(workspaceName.trim());
      setWorkspaceName('');
      onClose();
    }
  }, [onCreate, onClose, workspaceName]);

  const handleClose = useCallback(() => {
    setWorkspaceName('');
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Workspace</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Workspace Name"
          type="text"
          fullWidth
          value={workspaceName}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkspaceModal;