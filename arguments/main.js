'use strict'

const {app, BrowserWindow} = require('electron')

console.log(process.argv)

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
