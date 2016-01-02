'use strict'

class FormMaker {
  constructor() {
    this.form = document.createElement('form')
    this.firstField = null
    this.fields = {}
  }
  add(name, label, tagName, type) {
    type = type || 'text'

    let p = document.createElement('p')
    p.setAttribute('style', 'display: flex')
    this.form.appendChild(p)

    let label_ = document.createElement('label')
    label_.textContent = label + (type === 'checkbox' ? '' : ':')

    p.appendChild(label_)

    let field = document.createElement(tagName)
    field.name = name
    field.setAttribute('type', type)

    this.fields[name] = field
    if (!this.firstField) {
      this.firstField = field
    }

    if (type === 'checkbox') {
      field.setAttribute('style', 'margin-right: 5px')
      p.insertBefore(field, label_)
    } else {
      label_.setAttribute('style', 'margin-right: 5px')
      field.setAttribute('style', 'flex: 1')
      p.appendChild(field)
    }
  }
  setValue(name, value) {
    this.fields[name].value = value
  }
  addButton(label) {
    let p = document.createElement('p')
    this.form.appendChild(p)

    let button = document.createElement('button')
    button.textContent = label
    button.onclick = (evt) => {
      evt.preventDefault()
      this.callback(this.getValues())
    }
    p.appendChild(button)
  }
  onSubmit(fn) {
    this.callback = fn
  }
  getValues() {
    let result = {}
    let fields = this.form.elements
    for (let i=0; i < fields.length; i++) {
      let field = fields[i]
      if (field.name) {
        result[field.name] = (field.type === 'checkbox' ? field.checked : field.value)
      }
    }
    return result
  }
  render(selector) {
    let el = document.querySelector(selector)
    el.appendChild(this.form)
    this.firstField.focus()
  }
}

module.exports = FormMaker
