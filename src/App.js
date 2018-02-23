import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {

  constructor(props) {
    const meeting = {
      items: [
      {id: 1, title: 'treasurer\'s report'},
      {id: 6, title: 'secretarie\'s report'},
      {id: 23, title: 'convenors\'s report'},
      {id: 103, title: 'directors\' report'},
      ]
    }
    super(props)
    this.state = {
      meeting: meeting,
    }
    this.handleNewItem = this.handleNewItem.bind(this)
  }

  handleNewItem(item) {
    const addItem = (meeting, item) => {
      meeting.items.push(item)
      console.log('meeting', meeting)
      return meeting
    }
    this.setState(prevState => ({
      meeting: addItem(prevState.meeting, item)
    }))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to GOFF</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <AgendaItems items={this.state.meeting.items} />
        <NewItem handleNewItem={this.handleNewItem} />
        <Clock />
        <a href="https://github.com/ErichBSchulz/goff">Repo</a>
        <a href="https://cloud.digitalocean.com/droplets?i=d0d755">Server</a>
        <a href="https://reactjs.org/docs/hello-world.html">React</a>
      </div>
    )
  }
}

class AgendaItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: props.items,
    }
  }

  render() {
    const items = this.state.items
    const listItems = items.map((item) =>
      <li key={item.id}>{item.title}</li>)
    return <ul>{listItems}</ul>
  }
}

class NewItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isGoing: true,
      numberOfGuests: 2
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
    this.props.handleNewItem({id:5, title: 'bless you'})
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Submit Item" />
      </form>
    )
  }
}


class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      votes: 1
    }
    this.upVote = this.upVote.bind(this)
    this.downVote = this.downVote.bind(this)
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      10000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({ // do a shallow merge
      date: new Date()
    })
  }

  upVote() { this.vote(1) }
  downVote() { this.vote(-1) }

  vote(n) {
    this.setState(prevState => ({
      votes: prevState.votes + n
    }))
  }

  render() {
    return (
        <h6>
        <button onClick={this.upVote}> +1 </button>
        <button onClick={this.downVote}> -1 </button>
        {this.state.votes} votes as at
        {this.state.date.toLocaleTimeString()}.
        </h6>
    )
  }
}

export default App
