const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1770,
    height: 1020,
    fullscreen: false,
    autoHideMenuBar: true,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Overriding Menu
const template = [
   {
     label: 'File',
      submenu: [
         {
     label: 'New Window',
     accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
     click () { createWindow() }
  },
   { 
     role: 'quit',
     accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4'}
      ]
   },
   
//   {
//      label: 'Edit',
//      submenu: [
//         {
//            role: 'undo'
//         },
//         {
//            role: 'redo'
//         },
//         {
//            type: 'separator'
//         },
//         {
//            role: 'cut'
//         },
//         {
//            role: 'copy'
//         },
//         {
//            role: 'paste'
//         }
//      ]
//   },
   
   {
      label: 'View',
      submenu: [
         {
            role: 'reload'
         },
         {
            role: 'forceReload'
         },
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },
   
   {
      role: 'window',
      submenu: [
         {
            role: 'minimize'
         },
         {
            role: 'close'
         }
      ]
   }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.