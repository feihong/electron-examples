'use strict'
const exec = require('child_process').exec

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('Received message: ' + arg)

  exec('ps -e -o pid,user,args | grep electron', (error, stdout, stderr) => {
    // Split output into lines, leave out the ps command.
    let lines = stdout.trim().split('\n').filter(line => {
      return line.indexOf('grep electron') === -1
    })
    // Split lines into an array for each column.
    let results = lines.map(line => {
      let parts = line.split(' ')
      return {
        pid: parts[0],
        user: parts[1],
        command: parts.slice(2).join(' ')
      }
    })
    event.sender.send('asynchronous-reply', results)
  })
})
