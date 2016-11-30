'use strict';

const http = require('http')
const {app, BrowserWindow} = require('electron')

// Port should be the first user-specified argument.
let port = process.argv[2]
let url = 'http://localhost:' + port + '/'
// We need to make a promise for the app ready event because it's likely to
// fire before the server is ready.
let appReady = new Promise(resolve =>  app.on('ready', resolve))

let mainWindow

setTimeout(checkUrlReady, 0)

function checkUrlReady() {
  let req = http.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Succesfully connected')
      createWindow()
    } else {
      throw 'Unable to connect to URL'
    }
  }).on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('Connection refused, trying again...')
      setTimeout(checkUrlReady, 100)
    } else {
      throw err
    }
  })
}

function createWindow() {
  appReady.then(() => {
    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadURL(url)
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
      mainWindow = null
      quit()
    })
  })
}

function quit() {
  app.quit()
  http.get(url + 'shutdown/', (res) => {
    console.log('Shutdown response status code: ' + res.statusCode)
  })
}

app.on('window-all-closed', quit)
