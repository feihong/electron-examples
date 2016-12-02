'use strict';

const http = require('http')
const child_process = require('child_process')
const {app, BrowserWindow} = require('electron')

let mainWindow
let serverProcess

main()

function main() {
  let appReady = new Promise(resolve =>  app.on('ready', resolve))
  let gotPort = new Promise(resolve => {
    let server = http.createServer()
    server.listen(0)
    server.on('listening', () => {
      resolve(server.address().port)
      server.close()
    })
  })

  gotPort.then(port => {
    startServer(port)
    appReady.then(() => createWindow(port))
  })
}

function startServer(port) {
  console.log(`Starting server on localhost:${port}`)
  let cmd = `python server.py ${port}`

  serverProcess = child_process.exec(cmd)
  serverProcess.on('error', err => {
    console.log(`Error with server: ${err}`)
  })
}

function createWindow(port) {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('http://localhost:' + port)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
    quit()
  })
}

function quit() {
  serverProcess.kill('SIGINT')
  app.quit()
}

app.on('window-all-closed', quit)
