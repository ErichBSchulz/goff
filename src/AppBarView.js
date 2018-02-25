import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import utils from './Utils'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
// import Checkbox from 'material-ui/Checkbox'


class AppBarRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
  }

  render() {
    return (
      <AppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" >
          {this.props.forum.title}
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
    )
  }
}

const mapStateToProps = state => {
  // props here become props in the component
  return {
    forum: state.forum,
    session: state.session,
  }
}

const AppBar1 = connect(mapStateToProps)(AppBarRaw)
export default AppBar1
