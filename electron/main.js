// electron/main.js (Updated with clearLastFolderPath function)
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron'); // ✅ IMPORT SHELL
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar'); // ✅ Import chokidar

let mainWindow;
let nodeIdCounter = 0;
let folderWatcher = null; // ✅ Variable to hold the chokidar watcher instance

const LAST_FOLDER_PATH_FILE = path.join(app.getPath('userData'), 'lastFolderPath.txt');
const RECENT_FOLDERS_FILE = path.join(app.getPath('userData'), 'recentFolders.json');
const IGNORE_SETTINGS_FILE = path.join(app.getPath('userData'), 'ignoreSettings.json'); // ✅ File for ignore settings

const DEFAULT_IGNORE_SETTINGS = { // ✅ Default ignore settings
  ignoredFolders: ['node_modules', '.git', '.next'],
  ignoredFiles: ['.DS_Store', 'Thumbs.db'] // Example default ignored files
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 2000);

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // --- TEST CODE (Keep this for now - it won't interfere) ---
  // const testDirPath = '/home/spirit-riddle/Desktop/code/content-compendium';
  // const treeData = buildDirectoryTree(testDirPath);
  // console.log("Directory Tree Data:", treeData);
  // --- END TEST CODE ---

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});