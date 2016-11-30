'use strict';

const http = require('http')
const {app, BrowserWindow} = require('electron')

// Port should be the first argument.
let port = process.argv[2]
let url = 'http://localhost:' + port + '/'

let mainWindow


setTimeout(checkUrlReady, 100)


function checkUrlReady() {
  let req = http.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Succesfully connected')
      createWindow()
    } else {
      throw 'Unable to connect to URL'
    }
  }).on('error', (err) => {
    console.log('error');
    if (err.code === 'ECONNREFUSED') {
      console.log('Connection refused, trying again...')
      setTimeout(checkUrlReady, 100)
    } else {
      throw err
    }
  })
}


app.on('window-all-closed', () => {
  app.quit()
  http.get(url + 'shutdown/', (res) => {
    console.log('Response status code: ' + res.statusCode)
  })
})


function createWindow() {
  // app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadURL(url)
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  // })
}
