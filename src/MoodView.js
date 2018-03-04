import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Debug  } from './Widgets'
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography'

class Mood extends Component {

//  constructor(props) {
//    super(props)
//  }
//
//
  narate = (tally, participants) => {
    const {
      support = [],
      love = [],
      timeAllowance = {},
    } = tally
    const times = Object.keys(timeAllowance)
    return <span>
          Out of {participants} particpants: {support[1] || 'none' } support, {
              support[-1]  || 'none'} oppose, {
                love[1] || 'none'} like and {
                  love[-1] || 'none'} fear.
          {times.length
            ? "  Regarding time, members desire the following: "
             +  times.map(time =>
            {return `${time} minutes (${timeAllowance[time]} people), `
            })
          : ''}.
          </span>
  }


  render() {
    const {
      index,
      mood,
      tally,
      participants,
      summary,
      } = this.props

    const heading = 'Mood'
    return (
      <div>
        <Card>
          <Typography>{heading}</Typography>
          <CardContent>
          {this.narate(tally, participants)}
       <Debug heading='mood' val={{mood, tally, summary}}/>
          </CardContent>
      </Card>
    </div>
    )
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
