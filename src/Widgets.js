import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Utils from './Utils'
import Pie from './PieView';
import {pieColors, //scaleColor
  } from './Theme';

class Debug extends Component {
  details = () => {
    const {heading, val} = this.props
    console.log('debuging', heading, val)
    return <Typography component='pre'>
         {Utils.stringify(val)}
      </Typography>
  }
  render() {
    const {heading} = this.props
    return <ExpandLite heading={heading} callBack={this.details} />
  }
}
Debug.propTypes = {
  heading: PropTypes.string,
  val: PropTypes.any.isRequired,
}
Debug.defaultProps = {
  heading: 'Debug',
}

// Expanding panel that only calculates values when expanded
class ExpandLite extends Component {
  state = {
    expanded: false,
  }
  handleChange = () => {
    this.setState({expanded: !this.state.expanded})
  }
  details = () => {
    if (this.state.expanded) {
      console.log('rending', this.props.heading)
      return this.props.callBack()
    }
  }
  render() {
    return <ExpansionPanel
      expanded={this.state.expanded} onChange={this.handleChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{this.props.heading}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {this.details()}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  }
}
ExpandLite.propTypes = {
  heading: PropTypes.string.isRequired,
  callBack: PropTypes.func.isRequired,
}

class MoodPie extends React.Component {
  render() {
    const {mood, total, size} = this.props
    const pie = [
        { value: mood[1] || 0,
          key: 1,
          color: pieColors.green,
        },
        { value: total - (mood[-1] || 0) - (mood[1] || 0),
          key: 2,
          color: pieColors.grey,
        },
        { value: mood[-1] || 0,
          key: 3,
          color: pieColors.red,
        },
      ]
    return <Pie
      data={pie}
      size={size} />
  }
}
MoodPie.propTypes = {
  mood: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.string
}
MoodPie.defaultProps = {
  size: "2em"
}

// wip
class Snack extends React.Component {
  state = {
    open: false,
  }

  handleClick = () => {this.setState({open: true })}

  handleClose = (event, reason) => {
    if (reason !== 'clickaway') this.setState({ open: false })
  }

  message = () => {
    if (this.state.open) {
      const msg = "Note archived"
      return msg
    }
  }

  actions = () => {
    if (this.state.open) {
      const actions = [
        <Button key="undo"
          onClick={this.handleClose}
          color="inherit" >
          Close
        </Button>,
        <IconButton key="close" aria-label="Close" color="inherit"
          onClick={this.handleClose} >
          <CloseIcon />
        </IconButton>,
      ]
      console.log('making actions')
      return actions
    }
    return []
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClick}>Open simple snackbar</Button>
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          SnackbarContentProps={{'aria-describedby': 'message-id'}}
          message={<span id="message-id">{this.message()}</span>}
          action={this.actions()}
        />
      </div>
    )
  }
}

Snack.propTypes = {
}

export {
  ExpandLite,
  Debug,
  MoodPie,
  Snack,
}
