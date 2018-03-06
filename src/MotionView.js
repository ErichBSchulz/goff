import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import Utils from './Utils'
import { getActionButtons } from './Meta'
import Mood from './MoodView'
import Members from './MemberView'
import ActionButtons from './ActionButtonView'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import './MotionView.css'

class MotionRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    this.motionActionButtons = getActionButtons('motion')
  }

  handleActionButton = (button, items) => {
    const activeVoters = Utils.currentVoters(this.props.session.users)
    items.forEach(motion => {
      console.log('button, motion', button, motion)
      const payload = {
        itemId: motion.id,
        voters: activeVoters,
        action: {[button.atribute]: button.value}
      }
      this.actionCreators.assertItem(payload)
    })
  }

  render() {
    const {
      motion,
      index,
      participants,
      } = this.props

    return (
      <div>
        <Card>
          <CardContent>


        <div className="goff-motion-view-motion-container">
          <div className="goff-motion-view-motion">
            <Typography variant={'title'} >
              Motion to: {motion.title}
            </Typography>
            <Typography variant='body2' >
              Motion: {motion.details}
            </Typography>
          </div>
          <div className="goff-motion-view-movers">
            <div className="goff-motion-view-moved">
              <Members
                heading='Moved'
                members={motion.movedBy}
                index={index}
                mode='plain' />
            </div>
            <div className="goff-motion-view-seconded">
              <Members
                heading='Seconded'
                members={motion.secondedBy}
                index={index}
                mode='plain' />
            </div>
          </div>
        </div>

            <Mood
              participants={participants}
              index={index}
              mood={motion.mood}
              tally={motion.moodTally}
              summary={motion.moodSummary} />
          </CardContent>
          <CardActions>
            <ActionButtons
              menu={this.motionActionButtons}
              handler={this.handleActionButton}
              items={[motion]}
            />
          </CardActions>
      </Card>
    </div>
    )
  }
}
MotionRaw.propTypes = {
  index: PropTypes.object.isRequired,
  motion: PropTypes.object.isRequired,
//  mode: PropTypes.oneOf['proxy', 'plain']
}
MotionRaw.defaultProps = {
//  mode: 'proxy',
}


// Returns a plain object, which is merged into component’s props
// If not subscribing to store updates, pass null instead of function
// Can take an optional second param [ownProps]
const mapStateToProps = state => {
    // props here become props in the component
  return {
    forum: state.forum,
    members: state.index.members,
    session: state.session,
  }
}
 
const Motion = connect(mapStateToProps)(MotionRaw)

export default Motion
