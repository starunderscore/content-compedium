// electron/main.js (Updated with workspace management)
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron'); // ✅ IMPORT SHELL
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar'); // ✅ Import chokidar

let mainWindow;
let nodeIdCounter = 0;
let folderWatcher = null; // ✅ Variable to hold the chokidar watcher instance

const LAST_FOLDER_PATH_FILE = path.join(app.getPath('userData'), 'lastFolderPath.txt'); // We might not need this anymore
const RECENT_FOLDERS_FILE = path.join(app.getPath('userData'), 'recentFolders.json'); // We might not need this anymore
const IGNORE_SETTINGS_FILE = path.join(app.getPath('userData'), 'ignoreSettings.json'); // ✅ File for ignore settings
const WORKSPACES_FILE = path.join(app.getPath('userData'), 'workspaces.json'); // File to store workspace data
const CHECKPOINTS_DIR = path.join(app.getPath('userData'), 'checkpoints'); // Directory to store checkpoints

const DEFAULT_IGNORE_SETTINGS = { // ✅ Default ignore settings
  ignoredFolders: ['node_modules', '.git', '.next'],
  ignoredFiles: ['.DS_Store', 'Thumbs.db'] // Example default ignored files
};

function ensureDirExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function ensureFileExists(filePath, defaultContent = '') {
  if (!fs.existsSync(filePath)) {
    ensureDirExists(filePath);
    fs.writeFileSync(filePath, defaultContent);
  }
}

function readWorkspaces() {
  try {
    const data = fs.readFileSync(path.join(app.getPath('userData'), 'workspaces.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // ✅ Return an empty array instead of undefined
  }
}

function saveWorkspaces(workspaces) {
  ensureDirExists(WORKSPACES_FILE);
  fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(workspaces, null, 2));
}

function readCheckpoints(workspaceId) {
  const checkpointFile = path.join(CHECKPOINTS_DIR, `${workspaceId}.json`);
  ensureDirExists(CHECKPOINTS_DIR);
  ensureFileExists(checkpointFile, '{}');
  const rawData = fs.readFileSync(checkpointFile);
  return JSON.parse(rawData);
}

function saveCheckpoints(workspaceId, checkpoints) {
  const checkpointFile = path.join(CHECKPOINTS_DIR, `${workspaceId}.json`);
  ensureDirExists(CHECKPOINTS_DIR);
  fs.writeFileSync(checkpointFile, JSON.stringify(checkpoints, null, 2));
}

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
  }, 5000);

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // --- IPC HANDLERS ---

  ipcMain.handle('create-workspace', async (event, workspaceName) => {
    const workspaces = readWorkspaces();
    const newWorkspace = {
      id: Date.now().toString(), // Simple unique ID
      name: workspaceName,
      // folders:,
      visible: true,
    };
    workspaces.push(newWorkspace);
    saveWorkspaces(workspaces);
    return newWorkspace;
  });

  ipcMain.handle('get-workspaces', async () => {
    return readWorkspaces();
  });

  ipcMain.handle('update-workspace-name', async (event, workspaceId, newName) => {
    const workspaces = readWorkspaces();
    const workspaceIndex = workspaces.findIndex(ws => ws.id === workspaceId);
    if (workspaceIndex !== -1) {
      workspaces[workspaceIndex].name = newName;
      saveWorkspaces(workspaces);
      return workspaces[workspaceIndex];
    }
    return null; // Or throw an error
  });

  ipcMain.handle('delete-workspace', async (event, workspaceId) => {
    const workspaces = readWorkspaces();
    const updatedWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
    saveWorkspaces(updatedWorkspaces);
    // Optionally delete associated checkpoints directory
    return true;
  });

  ipcMain.handle('add-folder-to-workspace', async (event, workspaceId, folderPath) => {
    const workspaces = readWorkspaces();
    const workspaceIndex = workspaces.findIndex(ws => ws.id === workspaceId);
    if (workspaceIndex !== -1) {
      if (!workspaces[workspaceIndex].folders.includes(folderPath)) {
        workspaces[workspaceIndex].folders.push(folderPath);
        saveWorkspaces(workspaces);
        return workspaces[workspaceIndex];
      }
      return workspaces[workspaceIndex]; // Folder already exists
    }
    return null; // Or throw an error
  });

  ipcMain.handle('remove-folder-from-workspace', async (event, workspaceId, folderPath) => {
    const workspaces = readWorkspaces();
    const workspaceIndex = workspaces.findIndex(ws => ws.id === workspaceId);
    if (workspaceIndex !== -1) {
      workspaces[workspaceIndex].folders = workspaces[workspaceIndex].folders.filter(folder => folder !== folderPath);
      saveWorkspaces(workspaces);
      return workspaces[workspaceIndex];
    }
    return null; // Or throw an error
  });

  ipcMain.handle('get-workspace-folders', async (event, workspaceId) => {
    const workspaces = readWorkspaces();
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    return workspace ? workspace.folders : null;
  });

  ipcMain.on('set-workspace-visibility', (event, workspaceId, visible) => {
    const workspaces = readWorkspaces();
    const workspaceIndex = workspaces.findIndex(ws => ws.id === workspaceId);
    if (workspaceIndex !== -1) {
      workspaces[workspaceIndex].visible = visible;
      saveWorkspaces(workspaces);
    }
  });

  ipcMain.handle('show-open-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'multiSelections'] // Allow multiple folders for workspaces
    });
    return result;
  });

  ipcMain.handle('load-ignore-settings', async () => {
    ensureFileExists(IGNORE_SETTINGS_FILE, JSON.stringify(DEFAULT_IGNORE_SETTINGS, null, 2));
    const rawData = fs.readFileSync(IGNORE_SETTINGS_FILE);
    return JSON.parse(rawData);
  });

  ipcMain.on('save-ignore-settings', (event, settings) => {
    ensureDirExists(IGNORE_SETTINGS_FILE);
    fs.writeFileSync(IGNORE_SETTINGS_FILE, JSON.stringify(settings, null, 2));
  });

  ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url);
  });

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