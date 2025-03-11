// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getFolderTree: (folderPath) => ipcRenderer.invoke('get-folder-tree', folderPath), // Expose getFolderTree function
  showOpenDialogForFolder: () => ipcRenderer.invoke('show-open-dialog-for-folder'), // ✅ NEW function to show open dialog
  getFileContent: (filePath) => ipcRenderer.invoke('get-file-content', filePath), // ✅ RENAMED function to getFileContent, and updated invoke channel
  getLastFolderPath: () => ipcRenderer.invoke('get-last-folder-path'), // ✅ Expose new function
  getRecentFolders: () => ipcRenderer.invoke('get-recent-folders'), // ✅ Expose getRecentFolders
  addRecentFolder: (folderPath) => ipcRenderer.invoke('add-recent-folder', folderPath), // ✅ Expose addRecentFolder
  getIgnoreSettings: () => ipcRenderer.invoke('get-ignore-settings'), // ✅ Expose getIgnoreSettings
  saveIgnoreSettings: (settings) => ipcRenderer.invoke('save-ignore-settings', settings), // ✅ Expose saveIgnoreSettings
  saveLastFolderPath: (folderPath) => ipcRenderer.invoke('save-last-folder-path', folderPath), // ✅ EXPOSE saveLastFolderPath HERE
  clearLastFolderPath: () => ipcRenderer.invoke('clear-last-folder-path'), // ✅ EXPOSE clearLastFolderPath HERE
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url), // ✅ Expose openExternalLink
  on: (channel, callback) => ipcRenderer.on(channel, callback), // ✅ Expose 'on' function
  off: (channel, callback) => ipcRenderer.removeListener(channel, callback), // ✅ Expose 'off' function
});