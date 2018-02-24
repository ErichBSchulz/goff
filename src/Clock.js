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
        -<button onClick={this.upVote}> +1 </button>
        -<button onClick={this.downVote}> -1 </button>-
        {this.state.votes} votes as at
        {this.state.date.toLocaleTimeString()}.
        </h6>
    )
  }
}

export default Clock
