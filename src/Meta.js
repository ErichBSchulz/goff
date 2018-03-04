import React from 'react'
import Utils from './Utils'
import Icon from 'material-ui/Icon';
import DoneIcon from 'material-ui-icons/Done'
import ClearIcon from 'material-ui-icons/Clear'
import ThumbDownIcon from 'material-ui-icons/ThumbDown'
import ThumbUpIcon from 'material-ui-icons/ThumbUp'
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward'
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward'

const motionActionButtons = [
  {key: 'support', icon: <DoneIcon />, atribute: 'support', value: +1},
  {key: 'oppose', icon: <ClearIcon />, atribute: 'support', value: -1},
  {key: 'up', icon: <ThumbUpIcon />, atribute: 'love', value: +1},
  {key: 'down', icon: <ThumbDownIcon />, atribute: 'love', value: -1},
  {key: 'more', icon: <ArrowUpwardIcon />, atribute: 'timeAllowance', value: 'more'},
  {key: 'less', icon: <ArrowDownwardIcon />, atribute: 'timeAllowance', value: 'less'},
]

const getActionButtons = (type) => {
  return motionActionButtons
}

// calculate the reference number of participants for a forum
const participantCount = (forum) => forum.members.length || 1000

export {
  getActionButtons,
  participantCount
}
