import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actionCreators  } from './Store'
import Utils from './Utils'
import Table from './TableView'
import ActionButtons from './ActionButtonView'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import DoneIcon from 'material-ui-icons/Done'
import ClearIcon from 'material-ui-icons/Clear'
import ThumbDownIcon from 'material-ui-icons/ThumbDown'
import ThumbUpIcon from 'material-ui-icons/ThumbUp'
import PieChart from 'react-minimal-pie-chart';

class ForumRaw extends Component {

  constructor(props) {
    super(props)
    const {dispatch} = props
    // create bound versions of functions so can
    // pass them down to our child later.
    this.actionCreators = bindActionCreators(actionCreators, dispatch)
    this.biglump = this.testData()
  }

  testData() {
    let counter = 0
    function createData(name, calories, fat, carbs, protein) {
      counter += 1
      return { id: counter, name, calories, fat, carbs, protein }
    }
    const pie = [
          { value: 10, key: 1, color: '#E38627' },
          { value: 15, key: 2, color: '#C13C37' },
          { value: 20, key: 3, color: '#6A2135' },
        ]
    const biglump = {
      heading: "Example table",
      columnMeta: [
        { id: 'name', type: 'text', padding: false, label: 'Dessert (100g serving)' },
        { id: 'calories', type: 'numeric', padding: true, label: 'Calories' },
        { id: 'fat', type: 'numeric', padding: true, label: 'Lipid (g)' },
        { id: 'carbs', type: 'numeric', padding: true, label: 'Carbs (g)' },
        { id: 'protein', type: 'numeric', padding: true, label: 'Protein (g)' },
        { id: 'total',
          type: 'numeric',
          padding: true,
          label: 'Total (g)',
          value: (row) => row.fat + row.carbs + row.protein,
        },
        { id: 'pie',
          type: 'chart',
          padding: true,
          label: 'pie',
          value: (row) => {
            const pie = [
                { value: row.fat, key: 1, color: '#E38627' },
                { value: row.carbs, key: 2, color: '#C13C37' },
                { value: row.protein, key: 3, color: '#6A2135' },
              ]
            return <PieChart data={pie} />
          }
        },
      ],
      menu: [
        {key: 'support', icon: <DoneIcon />, atribute: 'support', value: +1},
        {key: 'oppose', icon: <ClearIcon />, atribute: 'support', value: -1},
        {key: 'up', icon: <ThumbUpIcon />, atribute: 'useful', value: +1},
        {key: 'down', icon: <ThumbDownIcon />, atribute: 'useful', value: -1},
      ],
      handler: (button, items) => {
        console.log('button, items', button, items)
      },
      data: [
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Donut', 452, 25.0, 51, 4.9),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
        createData('Honeycomb', 408, 3.2, 87, 6.5),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Jelly Bean', 375, 0.0, 94, 0.0),
        createData('KitKat', 518, 26.0, 65, 7.0),
        createData('Lollipop', 392, 0.2, 98, 0.0),
        createData('Marshmallow', 318, 0, 81, 2.0),
        createData('Nougat', 360, 19.0, 9, 37.0),
        createData('Oreo', 437, 18.0, 63, 4.0),
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      page: 0,
      rowsPerPage: 5,
      order: 'asc',
      orderBy: 'calories',
      selected: [],
    }
    return biglump
  }

  render() {
    const activeVoters = Utils.currentVoters(this.props.session.users)
    console.log('activeVoters', activeVoters)
    return (
      <div>
        <Table
          biglump={this.biglump}
        />
        <AgendaItems
          items={this.props.forum.items}
          voters={activeVoters}
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

  handleAction = (button, items) => {
    items.forEach(item => {
      console.log('button, item', button, item)
      const payload = {
        itemId: item.id,
        voters: this.props.voters,
        action: {[button.atribute]: button.value}
      }
      console.log('payload', payload)
      this.props.assertItem(payload)
    })
  }

  render() {
    const actionButtons = [
      {key: 'support', icon: <DoneIcon />, atribute: 'support', value: +1},
      {key: 'oppose', icon: <ClearIcon />, atribute: 'support', value: -1},
      {key: 'up', icon: <ThumbUpIcon />, atribute: 'useful', value: +1},
      {key: 'down', icon: <ThumbDownIcon />, atribute: 'useful', value: -1},
    ]
    const items = this.props.items
    const itemSummary = item =>
      JSON.stringify(item.moodSummary) +
      JSON.stringify(item.moodTally)
    const listItems = items.map((item) =>
      <ListItem button key={item.id}>
        <ListItemSecondaryAction>
          <ActionButtons
            menu={actionButtons}
            handler={this.handleAction}
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
