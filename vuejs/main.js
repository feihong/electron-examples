const {app, BrowserWindow} = require('electron')

let mainWindow

app.on('window-all-closed', app.quit)

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 600, height: 700})
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})
