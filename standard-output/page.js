/*

I tried to use remote here and do remote.console.log() and similar variations
but it doesn't work. I know it's possible to put some stuff in another module
and then do remote.require('./module').someFunction(), but it's probably safest
to just use ipcRenderer.

*/

'use strict'
const ipcRenderer = require('electron').ipcRenderer

const phrases = [
  'Good morning',
  'I am so hungry',
  'Suffering succotash',
  'Allow me to awaken your force',
  'Something is not kosher about this burrito',
  'Dark clouds loom on the horizon. It reignites my wanderlust.'
]

const textarea = document.querySelector('textarea')
textarea.value = getValue()

function getValue() {
  let index = Math.floor(Math.random() * phrases.length)
  return phrases[index]
}

function submit() {
  let value = textarea.value
  console.log(value)
  ipcRenderer.send('channel', value)
  textarea.value = getValue()
}
