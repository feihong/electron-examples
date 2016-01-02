'use strict'
const ipcRenderer = require('electron').ipcRenderer
const FormMaker = require('./form-maker')


function main() {
  let fm = new FormMaker()
  fm.add('username', 'Username', 'input')
  fm.add('title', 'Project title', 'input')
  fm.add('organization', 'Organization', 'input')
  fm.add('desc', 'Description', 'input')
  fm.add('long_title', 'Long title', 'input')
  fm.add('long_desc', 'Long description', 'textarea')
  fm.add('gh_pages', 'Create branch for GitHub Pages', 'input', 'checkbox')
  fm.addButton('Submit')
  fm.render('#content')

  fm.onSubmit(data => sendValues(data))

  ipcRenderer.on('channel', (evt, mesg) => {
    fm.setValue('username', mesg)
  })
}

function sendValues(data) {
  ipcRenderer.send('channel', data)
}

main()
