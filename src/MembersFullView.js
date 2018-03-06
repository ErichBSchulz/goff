import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Members from './MemberView'
import { ExpandLite } from './Widgets'
import { connect } from 'react-redux'

// full detailed breakdown
// wip
class MembersFullRaw extends Component {

  render() {
    const {//members,
      heading,
      index} = this.props
      console.log('heading', heading)
      // fixme!!
    const members = Object.keys(index)
    // fixme - move out of render
    const details = () => {
      return (
      <Members members={members} index={index} />
      )
    }
        console.log('index', index)
    return (
      <ExpandLite heading={heading} callBack={details} />
      )
  }
}

MembersFullRaw.propTypes = {
  // members: PropTypes.array.isRequired,
  index: PropTypes.object.isRequired,
}
MembersFullRaw.defaultProps = {
  heading: 'Members',
}

const mapStateToProps = state => {
  return {
    index: state.index.members,
  }
}
 
const MembersFull = connect(mapStateToProps)(MembersFullRaw)

export default MembersFull
