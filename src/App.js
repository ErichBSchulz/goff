import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import configureStore from './Store'
import Forum from './ForumView'
import Item from './ItemView'
import AppBar from './AppBarView'
import Toolbox from './Toolbox'
import Theme from './Theme'
import { Snack } from './Widgets'
import './App.css'
import ReactGridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
const store = configureStore()

const Root = () => (
  <MuiThemeProvider theme={Theme}>
    <Provider store={store}>
      <Router>
        <Route path="/" component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>
)


class MyFirstGrid extends Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      // {i: 'forum', x: 0, y: 0, w: 3, h: 2, static: true},
      {i: 'forum', x: 0, y: 1, w: 12, h: 10, minW: 3 },
      {i: 'item', x: 0, y: 0, w: 12, h: 8, minW: 3},
      {i: 'tools', x: 5, y: 2, w: 2, h: 2, minH: 2,},
      {i: 'testing',x: 4, y: 5, w: 2, h: 1}
    ];
    return (
      <ReactGridLayout
       className="appLayout"
       layout={layout}
       cols={12}
       rowHeight={30}
       width={1200}
       >
          <div key="forum">
            <Forum/>
          </div>
          <div key="item">
            <Item item={this.props.item} />
          </div>
            <div key="tools">
          <Toolbox / >
          </div>
          <div key="testing">
            <Snack/>
          </div>
      </ReactGridLayout>
    )
  }
}

class AppRaw extends Component {

  render() {
    return (
      <div className="App">
        <AppBar />
        <div className="App-body">
          <MyFirstGrid
            item={this.props.item}
          />
        </div>
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
    forums: state.forums,
    forum: state.forum,
    item: state.item,
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
