import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Debug, ExpandLite } from './Widgets'
import Utils from './Utils'
import Typography from 'material-ui/Typography'
import Members from './MemberView'

class Mood extends Component {


//  constructor(props) {
//    super(props)
//  }

  narateSupport = (tally = {}) => {
    const {inversePluralise} = Utils
    const {
      support = [],
      love = [],
    } = tally
    return (support[1] || 'none') + " support "
      + inversePluralise(support[-1]) + ", "
      + (support[-1] || 'none') + " oppose"
      + inversePluralise(support[-1]) + ", "
      + (love[1] || 'none') + " like"
      + inversePluralise(support[-1]) + " and "
      + (love[-1] || 'none') + " fear"
      + inversePluralise(support[-1]) + "."
  }

  narateTime = (summary = {}) => {
    const {pluralise} = Utils
    const {timeAllowance} = summary
    return timeAllowance === undefined ? ''
    : timeAllowance + "minute" + pluralise(timeAllowance)
  }

  narateTimeDistribution = (tally) => {
    const {timeAllowance = {}} = tally
    const {toList, pluralise} = Utils
    const times = Object.keys(timeAllowance)
    const describeCount = time => (
      time + " minute" + pluralise(time)
      + " (" + timeAllowance[time] + " " +
      pluralise(timeAllowance[time], 'person', 'people')
      + ")"
     )
    return times.length === 0
      ? ''
      : toList(times.map(describeCount)) + '.'
  }

  callBack = () => {
    const {
      index,
      mood,
      tally,
      participants,
      summary,
      } = this.props
    const cluster = Utils.cluster(mood)
    const memberCluster = (title, attibute, value) => {
      const list = (cluster[attibute] || {})[value]
      if (list) {
        return (<div>
           {title}: <Members members={list} index={index} mode='plain' />
          </div>)
      }
      else {
        return ''
      }
    }

    return (<div>
          {memberCluster('Love', 'love', '1')}
          {memberCluster('Fear', 'love', '-1')}
          {memberCluster('Support', 'support', '1')}
          {memberCluster('Oppose', 'support', '-1')}
        <Debug heading='Debug mood' val={{mood, tally, summary, cluster}}/>
        <Typography variant="body1" gutterBottom align="right">
          {participants} participants
        </Typography>
      </div>)
  }

  render() {
    const {
      tally,
      summary,
      } = this.props

    const heading =
      "Mood: " + this.narateSupport(tally) + " " + this.narateTime(summary)
    return (
      <div>
        <ExpandLite heading={heading} callBack={this.callBack} />
      </div>)
  }
}
Mood.propTypes = {
  index: PropTypes.object.isRequired,
  mood: PropTypes.object.isRequired,
  tally: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired,
}
Mood.defaultProps = {
  mood: {},
  tally: {},
  summary: {},
}

export default Mood
