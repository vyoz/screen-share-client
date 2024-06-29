const { app, BrowserWindow } = require('electron');
const path = require('path');
const log = require('electron-log');
require('electron-debug')({ showDevTools: true });

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  log.info('Main window created');
  console.log('Main window created');
  //mainWindow.loadURL('http://localhost:4200');

  const emberAppLocation = 'serve://dist';
  mainWindow.loadURL(emberAppLocation);

  mainWindow.webContents.on('did-fail-load', () => {
    mainWindow.loadURL(emberAppLocation);
  });

  mainWindow.webContents.on('crashed', () => {
    console.log(
      'Your Ember app (or other code) in the main window has crashed.',
    );
  });

  mainWindow.on('unresponsive', () => {
    console.log(
      'Your Ember app (or other code) has made the window unresponsive.',
    );
  });

  mainWindow.on('responsive', () => {
    console.log('The main window has become responsive again.');
  });

  mainWindow.webContents.openDevTools(); // Open Developer Tools
}

app.on('ready', () => {
  console.log('App is ready');
  log.info('App is ready');
  createWindow();
  // Allow insecure content for testing purposes
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:",
        ],
      },
    });
  });
});

app.on('window-all-closed', () => {
  log.info('Main window closed');
  console.log('Main window closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  log.info('App activated');
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
