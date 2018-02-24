import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'

class ForumRaw extends Component {

  constructor(props) {
    console.log('props', props)
    super(props)
    const {dispatch} = props;
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    console.log('this.actionCreators ', this.actionCreators )
  }

  render() {
    console.log('rendering main')
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

  render() {
    console.log('rendering sub')
    const items = this.props.items
    console.log('items', items)
    const listItems = items.map((item) =>
      <li key={item.id}>{item.title}</li>)
    return <ul>{listItems}</ul>
  }
}

class NewItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isGoing: true,
      title: 2
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
    const title = 'bless you'
    this.props.addItem({
      title: title})
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
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
