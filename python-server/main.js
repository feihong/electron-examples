'use strict';

const http = require('http')
const child_process = require('child_process')
const {app, BrowserWindow} = require('electron')

let mainWindow
let serverProcess

main()

function main() {
  let appReady = new Promise(resolve =>  app.on('ready', resolve))

  coroutine(function *() {
    let values = yield Promise.all([appReady, getUnusedPort()])
    let port = values[1]
    startServer(port)
    yield sleep(3)
    createWindow(port)
  })
}

function startServer(port) {
  console.log(`Starting server on localhost:${port}`)
  let cmd = `python server.py ${port}`

  serverProcess = child_process.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(`Server error: ${err}`);
    }
  })
}

function getUnusedPort() {
  return new Promise(resolve => {
    let server = http.createServer()
    server.listen(0)
    server.on('listening', () => {
      resolve(server.address().port)
      server.close()
    })
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

function coroutine(fn) {
  function run(gen, value) {
    let result = gen.next(value)
    if (!result.done) {
      result.value.then(value => setImmediate(run, gen, value))
    }
  }
  run(fn())
}

function sleep(secs) {
  return new Promise(resolve => setTimeout(resolve, secs * 1000))
}
