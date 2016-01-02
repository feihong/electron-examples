import {ipcRenderer} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'


class HelloWorld extends React.Component {
  constructor(props) {
    super(props)
    this.state = {results: null}
  }
  componentDidMount() {
    ipcRenderer.on('asynchronous-reply', (event, results) => {
      this.setState({results: results})
    })
  }
  render() {
    return <div>
      <h2>Versions</h2>
      <table>
        <tbody>{this.renderVersions()}</tbody>
      </table>

      {!this.state.results && this.renderButton()}
      {this.state.results && this.renderResults()}
    </div>
  }
  renderVersions() {
    return ['node', 'chrome', 'electron'].map(name => {
      return <tr key={name}>
        <td style={{textTransform: 'capitalize'}}>
          <b>{name}:</b>
        </td>
        <td>{process.versions[name]}</td>
      </tr>
    })
  }
  renderButton() {
    return <div>
      <button onClick={this.handleClick}>Show electron processes</button>
    </div>
  }
  renderResults() {
    let rows = this.state.results.map(result => {
      return <tr key={result.pid}>
        <td>{result.pid}</td>
        <td>{result.user}</td>
        <td>{result.command}</td>
      </tr>
    })

    return <div>
      <h2>Processes</h2>
      <table className='processes'>
        <thead>
          <tr>
            <th>pid</th>
            <th>user</th>
            <th>command</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  }
  handleClick() {
    ipcRenderer.send('asynchronous-message', 'get processes')
  }
}

ReactDOM.render(<HelloWorld /> , document.getElementById('content'))
