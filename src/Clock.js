import React from 'react'

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
      1000
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

  render() {
    return (
        <h6>
        {this.state.date.toLocaleTimeString()}.
        </h6>
    )
  }
}

export default Clock
