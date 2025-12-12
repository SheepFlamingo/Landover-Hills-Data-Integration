// Electron main process for desktop application

const { app, BrowserWindow } = require('electron');
const path = require('path');

// This function will be called when Electron has finished
// initialization and is ready to create browser windows.
async function createWindow() {
  // Use a dynamic import for 'electron-is-dev'
  const { default: isDev } = await import('electron-is-dev');

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the app.
  const startUrl = isDev
    ? 'http://localhost:3000' // Development: Load from React's dev server
    : `file://${path.join(__dirname, 'index.html')}`; // Production: Load the built index.html

  win.loadURL(startUrl);

  // Open the DevTools in development.
  if (isDev) {
    win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window on macOS when the dock icon is clicked.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});