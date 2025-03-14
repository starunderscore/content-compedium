// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Workspace Management
  createWorkspace: async (workspaceName) => await ipcRenderer.invoke('create-workspace', workspaceName),
  getWorkspaces: async () => await ipcRenderer.invoke('get-workspaces'),
  updateWorkspaceName: async (workspaceId, newName) => await ipcRenderer.invoke('update-workspace-name', workspaceId, newName),
  deleteWorkspace: async (workspaceId) => await ipcRenderer.invoke('delete-workspace', workspaceId),
  addFolderToWorkspace: async (workspaceId, folderPath) => await ipcRenderer.invoke('add-folder-to-workspace', workspaceId, folderPath),
  removeFolderFromWorkspace: async (workspaceId, folderPath) => await ipcRenderer.invoke('remove-folder-from-workspace', workspaceId, folderPath),
  getWorkspaceFolders: async (workspaceId) => await ipcRenderer.invoke('get-workspace-folders', workspaceId),
  setWorkspaceVisibility: (workspaceId, visible) => ipcRenderer.send('set-workspace-visibility', workspaceId, visible),

  // Checkpoint Management
  saveCheckpoint: async (workspaceId, checkpointName, checkedItems) => await ipcRenderer.invoke('save-checkpoint', workspaceId, checkpointName, checkedItems),
  loadCheckpoint: async (workspaceId, checkpointName) => await ipcRenderer.invoke('load-checkpoint', workspaceId, checkpointName),
  getCheckpointsForWorkspace: async (workspaceId) => await ipcRenderer.invoke('get-checkpoints-for-workspace', workspaceId),
  deleteCheckpoint: async (workspaceId, checkpointName) => await ipcRenderer.invoke('delete-checkpoint', workspaceId, checkpointName),

  // Content Retrieval
  showOpenDialog: async () => await ipcRenderer.invoke('show-open-dialog'),
  getWorkspaceTree: async (workspaceFolders) => await ipcRenderer.invoke('get-workspace-tree', workspaceFolders), // Now takes an array of folder paths
  readFileContent: async (filePath) => await ipcRenderer.invoke('read-file-content', filePath),

  // Settings
  saveIgnoreSettings: (settings) => ipcRenderer.send('save-ignore-settings', settings),
  loadIgnoreSettings: async () => await ipcRenderer.invoke('load-ignore-settings'),

  // External Links
  openExternalLink: (url) => ipcRenderer.send('open-external-link', url),
});

window.addEventListener('DOMContentLoaded', () => {
  // You can add any additional preload scripts here if needed
});