import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Icon from 'material-ui/Icon';
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
    const ac = this.actionCreators
    const tip = user =>
      `${user.title} is recored as ${user.present ? 'here' : 'absent'} and has a local status of ${user.localStatus}`
    return (
      <AppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" >
          {this.props.forum.title}
        </Typography>
        {this.props.session.users.map(user =>
          <Badge
            key={user.id}
            color={user.localStatus === "active" ? "secondary" : "default"}
            badgeContent={user.votingFor.length}
            >
            <Button color="inherit"
            onClick={e => ac.toggleUserLocalStatus(user)}
            title={tip(user)}
            >
              {user.title}
              {user.localStatus === 'active'
                ? <Icon color="action">add_circle</Icon>
                : <Icon color="disabled">remove_circle_outline</Icon>
              }
            </Button>
          </Badge>
        )}
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
