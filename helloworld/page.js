'use strict'
const ipcRenderer = require('electron').ipcRenderer

function sendMessage() {
  ipcRenderer.send('asynchronous-message', 'do it')
}

ipcRenderer.on('asynchronous-reply', (event, lines) => {
  let html = '<h2>electron processes</h2>' +
    '<ul style="font-family: monospace"><li>' +
    lines.join('</li><li>') +
    '</li></ul>'
  document.getElementById('command-result').innerHTML = html
})
