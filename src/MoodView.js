import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Debug, ExpandLite } from './Widgets'
import Utils from './Utils'
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography'

class Mood extends Component {


//  constructor(props) {
//    super(props)
//  }

  narateSupport = (tally = {}) => {
    const {inversePluralise} = Utils
    const {
      support = [],
      love = [],
      timeAllowance = {},
    } = tally
    return <span>
      {support[1] || 'none' } support
      {inversePluralise(support[-1])}, {
        support[-1]  || 'none'} oppose{inversePluralise(support[-1])}, {
        love[1] || 'none'} like{inversePluralise(support[-1])} and {
        love[-1] || 'none'} fear{inversePluralise(support[-1])}.
      </span>
  }

  narateTime = (summary = {}) => {
    const {pluralise} = Utils
    const {timeAllowance} = summary
    return timeAllowance === undefined ? ''
    : <span>{timeAllowance} minute{pluralise(timeAllowance)}</span>
  }

  narateTimeDistribution = (tally) => {
    const {timeAllowance = {}} = tally
    const {toList, pluralise} = Utils
    const times = Object.keys(timeAllowance)
    return times.length === 0 ? ''
      : <span>{
         toList(
           times.map(time =>
             `${time} minute${pluralise(time)}
             (${timeAllowance[time]}
              ${pluralise(timeAllowance[time], 'person', 'people')})`)) + '.'}
          </span>
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
    return (<div>
      <Debug heading='Debug mood' val={{mood, tally, summary, cluster}}/>
      <Card>
        <CardContent>
          <Typography variant="headline" component="h2">
            More stuff
          </Typography>
          <Typography component="p">

  MASH star and Cogsworth voice actor David Ogden Stiers dies aged 75
  Updated about 4 hours ago
  Actor David Ogden Stiers as the MASH character Major Charles Winchester
  PHOTO: Stiers was best known for his role as Major Charles Winchester in the television series MASH. (Supplied: 20th Century Fox Televison)

          </Typography>
         </CardContent>
      </Card>
      </div>)
  }

  render() {
    const {
      mood,
      tally,
      participants,
      summary,
      } = this.props

    const heading = [<span>Mood:</span>, this.narateSupport(tally), this.narateTime(summary)]
    return (
      <div>
        <ExpandLite heading={heading} callBack={this.callBack} />
        <Typography variant="body1" gutterBottom align="right">
          {participants} participants
        </Typography>
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
