import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import utils from './Utils'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import DoneIcon from 'material-ui-icons/Done';
import ClearIcon from 'material-ui-icons/Clear';
import ThumbDownIcon from 'material-ui-icons/ThumbDown';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';


class ForumRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props;
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
  }

  render() {
    console.log('this.props.forum.items', this.props.forum.items)
    return (
      <div>
        <AgendaItems items={this.props.forum.items} {...this.actionCreators} />
<h3>{this.props.forum.items.length} items</h3>
        <NewItem {...this.actionCreators} />
      </div>
    )
  }
}

// Returns a plain object, which is merged into component’s props
// If not subscribing to store updates, pass null instead of function
// Can take an optional second param [ownProps]
const mapStateToProps = state => {
    // props here become props in the component
  return {forum: state.forum}
}
 
const Forum = connect(mapStateToProps)(ForumRaw)

class AgendaItems extends React.Component {

  constructor(props) {
    super(props)
    console.log('props', props)
  }

  handleAction = (button, item) => {
    console.log('button, item', button, item)
    this.assign
  }

  render() {
    const actionButtons = [
      {key: 'support', icon: <DoneIcon />, atribute: 'support', value: +1},
      {key: 'oppose', icon: <ClearIcon />, atribute: 'support', value: -1},
      {key: 'up', icon: <ThumbUpIcon />, atribute: 'useful', value: +1},
      {key: 'down', icon: <ThumbDownIcon />, atribute: 'useful', value: -1},
    ]
    const items = this.props.items
    const listItems = items.map((item) =>
      <ListItem button key={item.id}>
        {actionButtons.map(button =>
          <IconButton
            onClick={() => this.handleAction(button, item)}
            key={button.key}
            aria-label={button.key}
            color="primary">
            {button.icon}
          </IconButton>
        )}
        <ListItemText primary={item.title} />
      </ListItem>)
    return <List>{listItems}</List>
  }
}

class NewItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      urgent: false,
      title: "My item"
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({[target.name]: value})
  }

  handleSubmit(event) {
    console.log('this.props', this.props)
    const title = this.state.title
    this.props.addItem(utils.addId({
      title: title,
      urgent: this.state.urgent,
    }))
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

      <i className="material-icons md-18">face</i>
        <label>
          Urgent:
          <input name="urgent" type="checkbox"
            checked={this.state.urgent}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Submit Item" />
      </form>
    )
  }
}

export default Forum
