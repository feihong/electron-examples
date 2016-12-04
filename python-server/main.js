// How many seconds to wait for the server to start.
const TIMEOUT = 2
// Dimensions of the window.
const WINDOW_DIMENSIONS = {width: 800, height: 600}

const http = require('http')
const child_process = require('child_process')
const {app, BrowserWindow} = require('electron')

let mainWindow
let serverProcess

main()

function main() {
  app.on('window-all-closed', quit)

  let appReady = new Promise(resolve => app.on('ready', resolve))

  coroutine(function *() {
    // If the app is ready AND we've obtained an unused port.
    let values = yield Promise.all([appReady, getUnusedPort()])
    let port = values[1]
    let procInfo = startServer(port)
    let serverIsUp = yield waitForServerStartUp(port, procInfo)
    if (serverIsUp) {
      let url = `http://localhost:${port}/`
      let title = yield getTitle(url)
      mainWindow = createWindow(url, title)
    } else {
      let message = procInfo.failed ?
        procInfo.errorMessage : 'Server took too long to start up'
      mainWindow = createErrorWindow(message)
    }
  })
}

function startServer(port) {
  console.log(`Starting server on localhost:${port}`)
  let cmd = `python server.py ${port}`
  // On Linux, we must use bash or we can't kill child processes.
  let options = (process.platform === 'linux') ? {shell: '/bin/bash'} : {}
  serverProcess = child_process.exec(cmd, options, (err, stdout, stderr) => {
    console.log('Server process finished')
    // If there was an error and the parent process did not interrupt:
    if (err && err.signal !== 'SIGINT') {
      console.log(err)
      procInfo.failed = true
      procInfo.errorMessage = err.message
    }
  })
  // Return an object that indicates whether the child process crashed.
  let procInfo = {failed: false, errorMessage: null}
  return procInfo
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

// If the server starts up in time, return Promise{true}, otherwise
// Promise{false}.
function waitForServerStartUp(port, procInfo) {
  return coroutine(function *() {
    let start = new Date()
    while (true) {
      if (procInfo.failed) {
        return false    // child process crashed
      } else if (yield serverIsUp(port)) {
        return true
      }
      console.log('Server is not up yet, sleeping...')
      yield sleep(0.2)

      let now = new Date()
      if ((now - start) > (TIMEOUT * 1000)) {
        // Server took too long to start up.
        return false
      }
    }
  })
}

// If server is up, return Promise{true}, otherwise Promise{false}.
function serverIsUp(port) {
  // Use HEAD request because we don't care about response body.
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
        let err = new Error(`Server returned status code ${res.statusCode}`)
        reject(err)
      }
    }).on('error', err => {
      // Assume that connection refused means the server is still initializing.
      if (err.code === 'ECONNREFUSED') {
        resolve(false)
      }
    })
  })
}

function getTitle(url) {
  return new Promise(resolve => {
    http.get(url + 'title/', res => {
      res.on('readable', () => {
        res.setEncoding('utf8')
        resolve(res.read())
      })
    })
  })
}

function createWindow(url, title) {
  let options = Object.assign(
    {show: false, title: title},
    WINDOW_DIMENSIONS)
  let win = new BrowserWindow(options)
  win.loadURL(url)
  win.webContents.openDevTools()
  // Show after renderer process finishes drawing.
  win.once('ready-to-show', win.show)
  win.on('closed', quit)
  return win
}

function createErrorWindow(message) {
  let html = escapeHtml(message).replace(/\n/g, '<br>')

  let options = Object.assign({title: 'Error'}, WINDOW_DIMENSIONS)
  let win = new BrowserWindow(options)
  win.loadURL('about:blank')
  win.on('closed', quit)
  let contents = win.webContents
  let code = `
    document.body.innerHTML = '<h1>Error</h1><p></p>'
    document.body.children[1].innerHTML = ${JSON.stringify(html)}`
  contents.on('dom-ready', () => {
    contents.executeJavaScript(code)
  })
  return win
}

function quit() {
  mainWindow = null
  serverProcess.kill('SIGINT')
  app.quit()
}

// Allows you to write asynchronous code in a more readable way.
// Source: https://github.com/feihong/node-examples/blob/master/coroutine.js
function coroutine(fn) {
  function run(gen, resolve, value) {
    let result = gen.next(value)
    if (result.done) {
      resolve(result.value)
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

// Source: http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
