import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Mood from './MoodView'
import Motion from './MotionView'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import { Debug  } from './Widgets'
import Utils from './Utils'
import { getActionButtons, participantCount } from './Meta'
import Members from './MemberView'
import ActionButtons from './ActionButtonView'
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

class ItemRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    this.itemActionButtons = getActionButtons('item')
  }

  handleActionButton = (button, items) => {
    const activeVoters = Utils.currentVoters(this.props.session.users)
    items.forEach(item => {
      console.log('button, item', button, item)
      const payload = {
        itemId: item.id,
        voters: activeVoters,
        action: {[button.atribute]: button.value}
      }
      this.actionCreators.assertItem(payload)
    })
  }

  render() {
    const {
      item = {},
      forum = {},
      members,
      } = this.props
    const {
      title,
      details,
      url,
      motions = [],
      mood,
      moodTally,
      moodSummary
      } = item
      console.log('members', members)
    // needed as a denominator
    const participants = participantCount(this.props.forum) || 1000
    const memberIds = Object.keys(members)

    return (
      <div>
        <Card>
          <CardContent>
            <Typography variant={'title'} >
              {title}
            </Typography>
            <Typography component={'p'} >
              {details}
            </Typography>
            {motions.map(motion =>
              <Motion motion={motion}
                participants={participants}
                index={members} />)}
              <div>
                <Members
                  members={memberIds} index={members} />
                <Members members={memberIds}
                  index={members}
                  mode='plain'
                  />
                <Debug heading='motions' val={motions} />
                <Mood
                  index={members}
                  mood={mood}
                  tally={moodTally}
                  participants={participants}
                  summary={moodSummary} />
              </div>
          </CardContent>
          <CardActions>
            <ActionButtons
              menu={this.itemActionButtons}
              handler={this.handleActionButton}
              items={[item]}
            />
          </CardActions>
      </Card>
    </div>
    )
  }
}
ItemRaw.propTypes = {
  item: PropTypes.object.isRequired,
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
 
const Item = connect(mapStateToProps)(ItemRaw)

export default Item
