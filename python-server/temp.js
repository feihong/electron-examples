const http = require('http')

const url = 'http://ipecho.net'
// const url = 'http://localhost:39940'
let req = http.get(url, (res) => {
  console.log(res.statusCode);
})
req.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log('Connection refused');
  }
})
