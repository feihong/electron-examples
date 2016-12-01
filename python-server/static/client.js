getRandomText()

function getRandomText() {
  fetch('/random-text/').then(res => {
    return res.text()
  }).then(text => {
    console.log(text)
    document.querySelector('div.random').textContent = text
  })
}
