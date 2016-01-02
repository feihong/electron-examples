'use strict'
const exec = require('child_process').exec

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.on('window-all-closed', () => app.quit())

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.on('closed', () => mainWindow = null)
  // mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('channel', 'SupremeOverlord')
  })
})

// Messages received from the renderer process get printed to standard out.
ipcMain.on('channel', (event, values) => {
  console.log(JSON.stringify(values, null, 2))
  app.quit()
})
