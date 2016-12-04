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
    // If the app is ready and we've obtained an unused port.
    let values = yield Promise.all([appReady, getUnusedPort()])
    let port = values[1]
    startServer(port)
    let serverIsUp = yield waitForServerStartUp(port)
    if (serverIsUp) {
      let url = `http://localhost:${port}/`
      let title = yield getTitle(url)
      createWindow(url, title)
    } else {
      createErrorWindow('Server took too long to start up')
    }
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
        let err = new Error(`Server returned status code ${res.statusCode}`)
        reject(err)
      }
    }).on('error', err => {
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
  mainWindow = new BrowserWindow(options)
  mainWindow.loadURL(url)
  mainWindow.webContents.openDevTools()
  mainWindow.once('ready-to-show', mainWindow.show)
  mainWindow.on('closed', quit)
}

function createErrorWindow(message) {
  let options = Object.assign({title: 'Error'}, WINDOW_DIMENSIONS)
  mainWindow = new BrowserWindow(options)
  mainWindow.loadURL('about:blank')
  mainWindow.on('closed', quit)
  let contents = mainWindow.webContents
  let code = `
    document.body.innerHTML = '<h1>Error</h1><p></p>'
    document.body.children[1].textContent = ${JSON.stringify(message)}`  
  contents.on('dom-ready', () => {
    contents.executeJavaScript(code)
  })
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
