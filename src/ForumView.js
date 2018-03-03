import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import Utils from './Utils'
import Table from './TableView'
import ActionButtons from './ActionButtonView'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Icon from 'material-ui/Icon';
import DoneIcon from 'material-ui-icons/Done'
import ClearIcon from 'material-ui-icons/Clear'
import ThumbDownIcon from 'material-ui-icons/ThumbDown'
import ThumbUpIcon from 'material-ui-icons/ThumbUp'
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward'
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward'
import Pie from './PieView';
import {pieColors, scaleColor} from './Theme';

const actionButtons = [
  {key: 'support', icon: <DoneIcon />, atribute: 'support', value: +1},
  {key: 'oppose', icon: <ClearIcon />, atribute: 'support', value: -1},
  {key: 'up', icon: <ThumbUpIcon />, atribute: 'love', value: +1},
  {key: 'down', icon: <ThumbDownIcon />, atribute: 'love', value: -1},
  {key: 'more', icon: <ArrowUpwardIcon />, atribute: 'timeAllowance', value: 'more'},
  {key: 'less', icon: <ArrowDownwardIcon />, atribute: 'timeAllowance', value: 'less'},
]

class ForumRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    this.agendaTable = this.makeAgendaTable()
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

  makeAgendaTable() {
    const participantCount = this.props.forum.members.length || 1000
    console.log('participantCount', participantCount)
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
            const scale = scaleColor(n / participantCount)
            return <Icon style={{color: scale}}>group</Icon>
          }
        },
        { id: 'love', label: 'Love',
          type: 'chart',
          padding: false,
          sortValue: row => row.moodSummary.love,
          value: row => {
            const scale = scaleColor(row.moodSummary.love / participantCount)
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
            const pie = [
                { value: mood[1] || 0,
                  key: 1,
                  color: pieColors.green,
                },
                { value: participantCount - (mood[-1] || 0) - (mood[1] || 0),
                  key: 2,
                  color: pieColors.grey,
                },
                { value: mood[-1] || 0,
                  key: 3,
                  color: pieColors.red,
                },
              ]
            return <Pie data={pie} size={"2em"} />
          },
          sortValue: row => row.moodSummary.support
        }
      ],
    }
    return biglump
  }

  render() {
    const activeVoters = Utils.currentVoters(this.props.session.users)
    return (
      <div>
        <Table
          heading={"Agenda"}
          meta={this.agendaTable.meta}
          data={this.props.forum.items}
          menu={actionButtons}
          handler={this.handleActionButton}
          startingState={this.agendaTable.startingState}
        />
        <AgendaItems
          items={this.props.forum.items}
          handler={this.handleActionButton}
          {...this.actionCreators} />
        <h3>{this.props.forum.items.length} items</h3>
        <h3>Voting for {activeVoters.length} members </h3>
        <NewItem {...this.actionCreators} />
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

class AgendaItems extends React.Component {

  constructor(props) {
    super(props)
    console.log('props', props)
  }

  render() {
    const items = this.props.items
    const itemSummary = item => JSON.stringify(item)
//      JSON.stringify(item.moodSummary) +
//      JSON.stringify(item.moodTally)
    const listItems = items.map((item) =>
      <ListItem button key={item.id}>
        <ListItemSecondaryAction>
          <ActionButtons
            menu={actionButtons}
            handler={this.props.handler}
            items={[item]}
          />
        </ ListItemSecondaryAction>
        <ListItemText
          primary={item.title}
          secondary={itemSummary(item)} />
      </ListItem>)
    return (
    <div>
      <List>{listItems}</List>
      { JSON.stringify(this.voters)}
    </div>
      )
  }
}





class NewItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      urgent: false,
      title: "My item"
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({[target.name]: value})
  }

  handleSubmit(event) {
    console.log('this.props', this.props)
    const title = this.state.title
    this.props.addItem(Utils.addId({
      title: title,
      urgent: this.state.urgent,
    }))
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

      <i className="material-icons md-18">face</i>
        <label>
          Urgent:
          <input name="urgent" type="checkbox"
            checked={this.state.urgent}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={this.state.title}
            onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Submit Item" />
      </form>
    )
  }
}

export default Forum
