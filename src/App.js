import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import configureStore from './Store'
import logo from './logo.svg'
import Forum from './ForumView'
import Clock from './Clock'
import './App.css'

const store = configureStore()

const Root = () => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>
)

class AppRaw extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to GOFF</h1>
        </header>
        <p className="App-intro">
          Experiments facilitating decisions.
        </p>
        <Forum />
        <Clock />
        <a href="https://github.com/ErichBSchulz/goff">Repo</a>
        <a href="https://cloud.digitalocean.com/droplets?i=d0d755">Server</a>
        <a href="https://reactjs.org/docs/hello-world.html">React</a>
      </div>
    )
  }
}

// Returns a plain object, which is merged into component’s props
// If not subscribing to store updates, pass null instead of function
// Can take an optional second param [ownProps]
const mapStateToProps = state => {
  return { // props here become props in the component
    users: state.users,
    forum: state.forum,
    forums: state.forums,
    // todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
 
// Can take an optional second param [ownProps]
const mapDispatchToProps = dispatch => {
  return { // elements here become props in the component
    // myHandler: id => { dispatch(myActionCreator(id)) }
  }
}
 
const App = connect(mapStateToProps, mapDispatchToProps)(AppRaw)

export default Root
