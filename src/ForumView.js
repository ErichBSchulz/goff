import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import { MoodPie  } from './Widgets'
import Utils from './Utils'
import Table from './TableView'
import Icon from 'material-ui/Icon';
import {scaleColor} from './Theme';
import { getActionButtons, participantCount } from './Meta'

class ForumRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    this.agendaTable = this.makeAgendaTable()
    this.itemActionButtons = getActionButtons('motion')
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
      if (items.length === 1) {
        this.actionCreators.setItem({item: items[0]})
      }
    })
  }

  makeAgendaTable() {
   const participants = participantCount(this.props.forum) || 1000
    console.log('participants', participants)
    const biglump = {
      startingState: {
        page: 0,
        rowsPerPage: 5,
        order: 'asc',
        orderBy: 'title',
        selected: [],
      },
      meta: [
        { id: 'title', type: 'text', padding: false, label: 'Item' },
        { id: 'motions', label: 'Motions',
          type: 'numeric',
          padding: true,
          value: row => (row.motions || []).length
        },
        { id: 'engagement', label: 'Engagement',
          type: 'chart',
          padding: true,
          sortValue: row => Object.keys(row.mood || {}).length,
          value: row => {
            const n = Object.keys(row.mood || {}).length
            const scale = scaleColor(n / participants)
            return <Icon style={{color: scale}}>group</Icon>
          }
        },
        { id: 'love', label: 'Love',
          type: 'chart',
          padding: false,
          sortValue: row => row.moodSummary.love,
          value: row => {
            const scale = scaleColor(row.moodSummary.love / participants)
            return <Icon style={{color: scale}}>favorite</Icon>
          }
        },
        { id: 'timeAllowance', label: 'Time',
          type: 'numeric',
          padding: true,
          value: row => row.moodSummary.timeAllowance
        },
        { id: 'pie',
          type: 'chart',
          padding: true,
          label: 'Support',
          value: row => {
            const mood = row.moodTally.support
            return <MoodPie
              mood={mood}
              total={participants}
              size={"2em"} />
          },
          sortValue: row => row.moodSummary.support
        }
      ],
    }
    return biglump
  }

  render() {
    return (
      <div>
        <Table
          heading={"Agenda"}
          meta={this.agendaTable.meta}
          data={this.props.forum.items}
          menu={this.itemActionButtons}
          handler={this.handleActionButton}
          startingState={this.agendaTable.startingState}
        />
      </div>
    )
  }
}

// Returns a plain object, which is merged into component’s props
// If not subscribing to store updates, pass null instead of function
// Can take an optional second param [ownProps]
const mapStateToProps = state => {
    // props here become props in the component
  return {
    forum: state.forum,
    session: state.session,
  }
}
 
const Forum = connect(mapStateToProps)(ForumRaw)

export default Forum
