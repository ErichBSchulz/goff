import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Utils from './Utils'
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
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
      console.log('memberId, index, mode', memberId, index, mode)
    const {expanded} = this.state
    const member = index[memberId]
    let label = member.title
    console.log('label', label)
    const {votingForIndex} = member
    let proxies = []
    if (mode === 'proxy') {
      proxies = votingForIndex.filter(mem => mem.id != memberId)
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
    const {members, index, mode, heading} = this.props
    const {expanded} = this.state

    if (expanded) {
      console.log('rendering member', members)
    }

    return (
      <Paper style={{padding: 5}} >
        <Typography variant="caption">
          {heading}
        </Typography>
        {members.map(id => <
        Member key={id} memberId={id} index={index} mode={mode} />)}
      </Paper>)
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

// full detailed breakdown
// wip
class MemberFull extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }
  handleChange = () => {
    this.setState({expanded: !this.state.expanded})
  }
  render() {
    const {memberId, index} = this.props
    const {expanded, heading} = this.state
    const member = index[memberId]
    const details = () => {
      if (expanded) {
        console.log('rendering', heading)
        return Utils.stringify(member)
      }
    }
    return <ExpansionPanel
      expanded={expanded} onChange={this.handleChange}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{heading}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography component='pre'>
           {details()}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  }
}
MemberFull.propTypes = {
  memberId: PropTypes.string.isRequired,
  index: PropTypes.object.isRequired,
}
//MemberFull.defaultProps = {
//  heading: 'Member',
//}

export default Members
export { MemberFull, Member }
