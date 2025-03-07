// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getFolderTree: (folderPath) => ipcRenderer.invoke('get-folder-tree', folderPath), // Expose getFolderTree function
  showOpenDialogForFolder: () => ipcRenderer.invoke('show-open-dialog-for-folder'), // ✅ NEW function to show open dialog
  getFileContent: (filePath) => ipcRenderer.invoke('get-file-content', filePath) // ✅ RENAMED function to getFileContent, and updated invoke channel
});