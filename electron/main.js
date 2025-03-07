// electron/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs'); // ✅ Add this line to import the 'fs' module

let mainWindow; // ✅ Declare mainWindow in the outer scope

let nodeIdCounter = 0; // Simple counter for unique IDs

function buildDirectoryTree(dirPath) {
  const excludedDirs = ['node_modules', '.next']; // Add common folders to exclude

  const rootName = path.basename(dirPath); // Root name from directory path
  const rootNode = {
    id: `node-${nodeIdCounter++}`, // Generate unique ID
    name: rootName,
    type: 'folder',
    filePath: dirPath, // ✅ Store filePath for the folder node
    children: [],
  };

  try {
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stats = fs.statSync(entryPath);

      if (excludedDirs.includes(entry)) { // ✅ Check if entry is in excluded list
        console.debug(`[buildDirectoryTree] Excluding directory: ${entry} in ${dirPath}`); // Optional debug log
        continue; // Skip to the next entry
      }

      if (stats.isDirectory()) {
        const childNode = buildDirectoryTree(entryPath); // Recursive call
        if (childNode) { // Check if recursive call returned a valid node
          rootNode.children.push(childNode);
        }
      } else {
        rootNode.children.push({
          id: `node-${nodeIdCounter++}`, // Generate unique ID
          name: entry,
          type: 'file',
          filePath: entryPath // ✅ Store filePath for the file node
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory or file: ${dirPath}`, error);
    return null; // Or handle error as needed
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

  // **ADD THIS DELAY:**
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000'); // Load Next.js app after a delay
  }, 2000); // 2000 milliseconds (2 seconds) delay

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // --- TEST CODE (Keep this for now - it won't interfere) ---
  const testDirPath = '/home/spirit-riddle/Desktop/code/content-compendium';
  const treeData = buildDirectoryTree(testDirPath);
  console.log("Directory Tree Data:", treeData);
  // --- END TEST CODE ---

  // ✅ ADD IPC HANDLER HERE:
  ipcMain.handle('get-folder-tree', async (event, folderPath) => {
    if (!folderPath) {
      console.error("No folder path provided to get-folder-tree handler");
      return null; // Or handle error as needed
    }
    console.log(`[MainProcess]: Received request to get folder tree for: ${folderPath}`); // Log!
    const tree = buildDirectoryTree(folderPath);
    console.log("Directory Tree Data with File Paths:", JSON.stringify(tree, null, 2)); // ✅ Log tree data with filePaths
    return tree; // Return the directory tree data to the renderer
  });

  ipcMain.handle('show-open-dialog-for-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, { // 'mainWindow' is important!
      properties: ['openDirectory'] //  'openDirectory' to select folders only
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0]; // Get the first selected folder path
      console.log(`[MainProcess]: Folder selected via dialog: ${folderPath}`); // Log!
      return folderPath; // Return the selected folder path to the renderer
    } else {
      console.log("[MainProcess]: Folder selection dialog canceled or no folder selected.");
      return null; // Or return undefined, or handle cancellation as needed
    }
  });

  // ✅ RENAMED IPC HANDLER and function for reading file content:
  ipcMain.handle('get-file-content', async (event, filePath) => { // ✅ Changed handler name to 'get-file-content'
    if (!filePath) {
      console.error("[MainProcess]: No file path provided to get-file-content handler"); // ✅ Updated log message
      return null;
    }

    try {
      console.log(`[MainProcess]: Reading content for: ${filePath}`);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      console.log("[MainProcess]: Successfully read file content.");
      return fileContent;
    } catch (error) {
      console.error(`[MainProcess]: Error reading file: ${filePath}`, error); // ✅ Updated log message
      return null;
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
  // ... rest of app.on('window-all-closed', ...) ...
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});