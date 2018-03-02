import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'

class ActionButtons extends Component {

  handleClick(button, items, e) {
    e.stopPropagation();
    this.props.handler(button, items)
    console.log('The link was clicked.');
  }

  // expects:
  // items: array of elements applicable to action
  // buttons: [{key, icon, <etc>}]
  // handler: (button, items)
  render() {
    const buttons = this.props.menu.map(button =>
      <IconButton
        onClick={(e) => this.handleClick(button, this.props.items, e)}
        key={button.key}
        aria-label={button.key}
        >
        {button.icon}
      </IconButton>
    )
    return <div>{buttons}</div>
  }
}

export default ActionButtons
