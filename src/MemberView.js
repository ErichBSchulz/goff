import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import PersonIcon from 'material-ui-icons/Person';
import PersonOutlineIcon from 'material-ui-icons/PersonOutline';
import GroupIcon from 'material-ui-icons/Group';

class Member extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }
  onClick = () => {
    this.setState({expanded: !this.state.expanded})
  }
  render() {
    const {memberId, index, mode} = this.props
    const me = memberId.toString() // make a safe string for comparison
    const {expanded} = this.state
    const member = index[memberId]
    let label = member.title
    const {votingForIndex} = member
    let proxies = []
    if (mode === 'proxy') {
      proxies = votingForIndex.filter(mem => mem.id.toString() !== me)
      // list out the proxies
      if (expanded) {
        label += proxies.length ? ` + (${proxies.map(mem => mem.title).join(', ')})` : ''
      }
      else if (proxies.length) {
        // has a proxy that is not self
        label += ' +' + proxies.length
      }
    }
    const avatar = (proxies.length)
      ? <Avatar><GroupIcon /></Avatar>
      : member.present ? <Avatar><PersonIcon /></Avatar>
      : <Avatar><PersonOutlineIcon /></Avatar>
    return <Chip style={{margin: 5}}
      key={memberId} avatar={avatar} label={label}
      onClick={this.onClick}
       />
  }
}

Member.propTypes = {
  memberId: PropTypes.string.isRequired,
  index: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['proxy', 'plain'])
}

class Members extends Component {
  render() {
    const {members, index, mode, heading} = this.props
    return (
      <div>
        <Typography variant="caption">
          {heading}
        </Typography>
        {members.map(id => <
        Member key={id} memberId={id} index={index} mode={mode} />)}
      </div>
        )
  }
}
Members.propTypes = {
  members: PropTypes.array.isRequired,
  index: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['proxy', 'plain']),
  heading: PropTypes.string
}
Members.defaultProps = {
  mode: 'proxy',
}

export default Members
export { Member }
