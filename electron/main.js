// electron/main.js (Updated with clearLastFolderPath function)
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let nodeIdCounter = 0;

const LAST_FOLDER_PATH_FILE = path.join(app.getPath('userData'), 'lastFolderPath.txt');
const RECENT_FOLDERS_FILE = path.join(app.getPath('userData'), 'recentFolders.json');
const IGNORE_SETTINGS_FILE = path.join(app.getPath('userData'), 'ignoreSettings.json'); // ✅ File for ignore settings

const DEFAULT_IGNORE_SETTINGS = { // ✅ Default ignore settings
  ignoredFolders: ['node_modules', '.git', '.next'],
  ignoredFiles: ['.DS_Store', 'Thumbs.db'] // Example default ignored files
};


function saveLastFolderPath(folderPath) {
  try {
    fs.writeFileSync(LAST_FOLDER_PATH_FILE, folderPath, 'utf8');
    console.log(`[MainProcess]: Saved last folder path: ${folderPath}`);
  } catch (error) {
    console.error("[MainProcess]: Error saving last folder path:", error);
  }
}

function getLastFolderPath() {
  try {
    if (fs.existsSync(LAST_FOLDER_PATH_FILE)) {
      const folderPath = fs.readFileSync(LAST_FOLDER_PATH_FILE, 'utf8');
      if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
        console.log(`[MainProcess]: Loaded last folder path: ${folderPath}`);
        return folderPath;
      } else {
        console.warn("[MainProcess]: Stored last folder path is invalid or not a directory.");
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("[MainProcess]: Error reading last folder path:", error);
    return null;
  }
}


function getRecentFolders() {
  try {
    if (fs.existsSync(RECENT_FOLDERS_FILE)) {
      const rawData = fs.readFileSync(RECENT_FOLDERS_FILE, 'utf8');
      const recentFolders = JSON.parse(rawData);
      console.log("[MainProcess]: Loaded recent folders:", recentFolders);
      return recentFolders;
    } else {
      console.log("[MainProcess]: Recent folders file not found, returning empty array.");
      return [];
    }
  } catch (error) {
    console.error("[MainProcess]: Error reading recent folders file, returning empty array:", error);
    return [];
  }
}

function addRecentFolder(folderPath) {
  const maxRecentFolders = 5;
  try {
    let recentFolders = getRecentFolders();
    const folderIndex = recentFolders.indexOf(folderPath);

    if (folderIndex !== -1) {
      // Folder already exists in recent folders, remove it from its current position
      recentFolders.splice(folderIndex, 1);
    }
    // Add the folder to the beginning of the array (top of the list)
    recentFolders.unshift(folderPath);

    if (recentFolders.length > maxRecentFolders) {
      recentFolders = recentFolders.slice(0, maxRecentFolders);
    }

    fs.writeFileSync(RECENT_FOLDERS_FILE, JSON.stringify(recentFolders), 'utf8');
    console.log("[MainProcess]: Updated recent folders (moved to top):", recentFolders); // Updated log message

  } catch (error) {
    console.error("[MainProcess]: Error updating recent folders (move to top):", error); // Updated error log message
  }
}

function getIgnoreSettings() { // ✅ Function to get ignore settings
  try {
    if (fs.existsSync(IGNORE_SETTINGS_FILE)) {
      const rawData = fs.readFileSync(IGNORE_SETTINGS_FILE, 'utf8');
      const ignoreSettings = JSON.parse(rawData);
      console.log("[MainProcess]: Loaded ignore settings from file:", ignoreSettings);
      return ignoreSettings;
    } else {
      // If no settings file, use default settings and save it
      console.log("[MainProcess]: Ignore settings file not found, using default settings.");
      saveIgnoreSettings(DEFAULT_IGNORE_SETTINGS); // Save default settings to file
      return DEFAULT_IGNORE_SETTINGS;
    }
  } catch (error) {
    console.error("[MainProcess]: Error reading ignore settings file, returning default settings:", error);
    saveIgnoreSettings(DEFAULT_IGNORE_SETTINGS); // Save default settings in case of error
    return DEFAULT_IGNORE_SETTINGS; // Return default settings on error
  }
}


function saveIgnoreSettings(settings) { // ✅ Function to save ignore settings
  try {
    fs.writeFileSync(IGNORE_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8'); // pretty print JSON
    console.log("[MainProcess]: Saved ignore settings:", settings);
  } catch (error) {
    console.error("[MainProcess]: Error saving ignore settings:", error);
  }
}

// ✅ NEW function to clear the last folder path
function clearLastFolderPath() {
  try {
    if (fs.existsSync(LAST_FOLDER_PATH_FILE)) {
      fs.unlinkSync(LAST_FOLDER_PATH_FILE); // Delete the file
      console.log("[MainProcess]: Cleared last folder path.");
    } else {
      console.log("[MainProcess]: No last folder path file to clear (file not found).");
    }
  } catch (error) {
    console.error("[MainProcess]: Error clearing last folder path:", error);
  }
}


function buildDirectoryTree(dirPath) {
  // ✅ Use ignore settings from file - FETCH SETTINGS HERE at the START of the function
  const ignoreSettings = getIgnoreSettings();
  const ignoredFolders = ignoreSettings.ignoredFolders || []; // Ensure it's an array, default to empty
  const ignoredFiles = ignoreSettings.ignoredFiles || [];     // Ensure it's an array, default to empty

  const rootName = path.basename(dirPath);
  const rootNode = {
    id: `node-${nodeIdCounter++}`,
    name: rootName,
    type: 'folder',
    filePath: dirPath,
    children: [],
  };

  try {
    const entries = fs.readdirSync(dirPath);

    const folders = [];
    const files = [];

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stats = fs.statSync(entryPath);

      // ✅ Check against user-defined ignored folders and files (names only) - CHECK HERE, BEFORE processing entry
      if (ignoredFolders.includes(entry)) {
        console.debug(`[buildDirectoryTree] Excluding folder (from settings): ${entry} in ${dirPath}`);
        continue; // Skip to the next entry, effectively ignoring this folder
      }
      if (ignoredFiles.includes(entry)) {
        console.debug(`[buildDirectoryTree] Excluding file (from settings): ${entry} in ${dirPath}`);
        continue; // Skip to the next entry, effectively ignoring this file
      }


      if (stats.isDirectory()) {
        const childNode = buildDirectoryTree(entryPath); // Recursive call - process folder if NOT ignored
        if (childNode) { // ✅ Add childNode only if it's not null (not ignored)
          folders.push(childNode);
        }
      } else {
        files.push({
          id: `node-${nodeIdCounter++}`,
          name: entry,
          type: 'file',
          filePath: entryPath
        });
      }
    }

    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));
    rootNode.children = [...folders, ...files];

  } catch (error) {
    console.error(`Error reading directory or file: ${dirPath}`, error);
    return null;
  }

  return rootNode;
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
  }, 2000);

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // --- TEST CODE (Keep this for now - it won't interfere) ---
  const testDirPath = '/home/spirit-riddle/Desktop/code/content-compendium';
  const treeData = buildDirectoryTree(testDirPath);
  console.log("Directory Tree Data:", treeData);
  // --- END TEST CODE ---


  ipcMain.handle('get-folder-tree', async (event, folderPath) => {
    if (!folderPath) {
      folderPath = getLastFolderPath();
      if (!folderPath) {
        console.log("[MainProcess]: No folder path provided and no last folder path found.");
        return null;
      }
      console.log(`[MainProcess]: No folder path provided, using last saved path: ${folderPath}`);
    }
    console.log(`[MainProcess]: Received request to get folder tree for: ${folderPath}`);
    const tree = buildDirectoryTree(folderPath);
    console.log("Directory Tree Data with File Paths:", JSON.stringify(tree, null, 2));
    return tree;
  });

  ipcMain.handle('show-open-dialog-for-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      console.log(`[MainProcess]: Folder selected via dialog: ${folderPath}`);
      saveLastFolderPath(folderPath);
      addRecentFolder(folderPath);
      return folderPath;
    } else {
      console.log("[MainProcess]: Folder selection dialog canceled or no folder selected.");
      return null;
    }
  });

  ipcMain.handle('get-file-content', async (event, filePath) => {
    if (!filePath) {
      console.error("[MainProcess]: No file path provided to get-file-content handler");
      return null;
    }

    try {
      console.log(`[MainProcess]: Reading content for: ${filePath}`);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      console.log("[MainProcess]: Successfully read file content.");
      return fileContent;
    } catch (error) {
      console.error(`[MainProcess]: Error reading file: ${filePath}`, error);
      return null;
    }
  });

  ipcMain.handle('get-last-folder-path', async (event) => {
    const lastPath = getLastFolderPath();
    console.log(`[MainProcess]: Request for last folder path. Returning: ${lastPath}`);
    return lastPath;
  });

  ipcMain.handle('save-last-folder-path', async (event, folderPath) => { // ✅ Handle 'save-last-folder-path' channel
    if (!folderPath) {
      console.error("[MainProcess]: No folder path provided to save-last-folder-path handler");
      return;
    }
    console.log(`[MainProcess]: Received request to save last folder path: ${folderPath}`);
    saveLastFolderPath(folderPath); // Call the saveLastFolderPath function
  });

  ipcMain.handle('get-recent-folders', async (event) => {
    const recentFolders = getRecentFolders();
    console.log("[MainProcess]: Request for recent folders. Returning:", recentFolders);
    return recentFolders;
  });

  ipcMain.handle('add-recent-folder', async (event, folderPath) => {
    if (!folderPath) {
      console.error("[MainProcess]: No folder path provided to add-recent-folder handler");
      return;
    }
    console.log(`[MainProcess]: Received request to add recent folder: ${folderPath}`);
    addRecentFolder(folderPath);
  });

  // ✅ NEW IPC Handler for getting ignore settings
  ipcMain.handle('get-ignore-settings', async (event) => {
    const settings = getIgnoreSettings();
    console.log("[MainProcess]: Request for ignore settings. Returning:", settings);
    return settings;
  });

  // ✅ NEW IPC Handler for saving ignore settings
  ipcMain.handle('save-ignore-settings', async (event, settings) => {
    if (!settings) {
      console.error("[MainProcess]: No settings provided to save-ignore-settings handler");
      return; // Or handle error as needed
    }
    console.log("[MainProcess]: Received request to save ignore settings:", settings);
    saveIgnoreSettings(settings);
  });

  // ✅ NEW IPC Handler for CLEAR last folder path (handling the clear-last-folder-path channel)
  ipcMain.handle('clear-last-folder-path', async (event) => { // ✅ Handle 'clear-last-folder-path' channel
    console.log("[MainProcess]: Received request to clear last folder path.");
    clearLastFolderPath(); // Call the clearLastFolderPath function
  });


  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});