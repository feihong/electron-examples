// How many seconds to wait for the server to start.
const TIMEOUT = 2

const http = require('http')
const child_process = require('child_process')
const {app, BrowserWindow} = require('electron')

let mainWindow
let serverProcess

main()

function main() {
  let appReady = new Promise(resolve =>  app.on('ready', resolve))

  coroutine(function *() {
    // If the app is ready and we've obtained an unused port.
    let values = yield Promise.all([appReady, getUnusedPort()])
    let port = values[1]
    startServer(port)
    yield waitForServerStartUp(port)
    createWindow(port)
  })
}

function startServer(port) {
  console.log(`Starting server on localhost:${port}`)
  let cmd = `python server.py ${port}`
  // On Linux, we need to use bash in order to kill child processes.
  let options = (process.platform === 'linux') ? {shell: '/bin/bash'} : {}
  serverProcess = child_process.exec(cmd, options, (err, stdout, stderr) => {
    console.log('Server process finished')
    if (err && err.signal !== 'SIGINT') {
      console.log(err)
    }
  })
  // serverProcess.stdout.pipe(process.stdout)
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

function waitForServerStartUp(port) {
  return coroutine(function *() {
    let start = new Date()
    while (true) {
      if (yield serverIsUp(port)) {
        break
      }
      console.log('Server is not up yet, sleeping...')
      yield sleep(0.2)

      let now = new Date()
      if ((now - start) > (TIMEOUT * 1000)) {
        throw 'Server took too long to start up'
      }
    }
  })
}

// Make a HEAD request to see if the server is up.
function serverIsUp(port) {
  let options = {
    host: 'localhost',
    port: port,
    method: 'HEAD',
  }
  return new Promise((resolve, reject) => {
    http.get(options, res => {
      if (res.statusCode === 200) {
        resolve(true)
      } else {
        reject(`Server returned status code ${res.statusCode}`)
      }
    }).on('error', err => {
      if (err.code === 'ECONNREFUSED') {
        resolve(false)
      }
    })
  })
}

function createWindow(port) {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(`http://localhost:${port}`)
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', quit)
}

function quit() {
  mainWindow = null
  serverProcess.kill('SIGINT')
  app.quit()
}

app.on('window-all-closed', quit)

// Allows you to write asynchronous code in a more readable way.
// Source: https://github.com/feihong/node-examples/blob/master/coroutine.js
function coroutine(fn) {
  function run(gen, resolve, value) {
    let result = gen.next(value)
    if (result.done) {
      resolve()
    } else {
      result.value.then(value => setImmediate(run, gen, resolve, value))
    }
  }
  return new Promise(resolve => {
    run(fn(), resolve)
  })
}

function sleep(secs) {
  return new Promise(resolve => setTimeout(resolve, secs * 1000))
}
