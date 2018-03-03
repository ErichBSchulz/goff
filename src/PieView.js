import React, { Component } from 'react'
import PieChart from 'react-minimal-pie-chart';

class Pie extends Component {

//  constructor(props) {
//    super(props)
//  }
//
  render() {
    const {size, data} = this.props
    return (
      <div>
        <PieChart data={data}
          lineWidth={75}
          startAngle={-90}
          style={{ height: size, width: size, float: 'right' }}
            />
      </div>
    )
  }
}

export default Pie
