import React, { Component } from 'react'
import Button from 'material-ui/Button'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import BuildIcon from 'material-ui-icons/Build';
import Menu, { MenuItem } from 'material-ui/Menu'

class Toolbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      links: [
        {
          title: "Repo",
          href: "https://github.com/ErichBSchulz/goff" },
        {
          title: "Server",
          href: "https://cloud.digitalocean.com/droplets?i=d0d755" },
        {
          title: "React",
          href: "https://reactjs.org/docs/hello-world.html" },
        {
          title: "Icons",
          href: "https://material.io/icons/" },
        {
          title: "Components",
          href: "https://material-ui-next.com/getting-started/supported-components/" }
     ]
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div >
      <List component="nav">
        {this.state.links.map(item => <a href={item.href}>
          <ListItem button key={item.title} >
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
        </a>)}
      </List>
      <div>
        <Button size="small" variant="raised" color="primary"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <BuildIcon />
          Tools
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.state.links.map(item =>
            <MenuItem onClick={this.handleClose} key={item.title} >
              <a href={item.href}>{item.title}</a>
            </MenuItem>
          )}
        </Menu>
      </div>
      </div>
    )
  }
}

export default Toolbox
