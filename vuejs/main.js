'use strict'

const exec = require('child_process').exec

const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

console.log('Node ', process.versions.node)
console.log('Chrome ', process.versions.chrome)
console.log('Electron ', process.versions.electron)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('Received message: ' + arg)

  exec('ps aux | grep electron', (error, stdout, stderr) => {
    let lines = stdout.trim().split('\n').filter(line => {
      return line.indexOf('grep electron') === -1
    })
    event.sender.send('asynchronous-reply', lines)
  })
})
