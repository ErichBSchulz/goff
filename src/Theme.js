import { createMuiTheme } from 'material-ui/styles'
import purple from 'material-ui/colors/purple'
import green from 'material-ui/colors/green'
import grey from 'material-ui/colors/grey'
import red from 'material-ui/colors/red'

// https://material.io/color/#!/?view.left=0&view.right=0&primary.color=2E7D32&secondary.color=7B1FA2

const theme = createMuiTheme({
  palette: {
    primary: { main: green[400]}, // Purple and green play nicely together.
    secondary: { main: grey[800] }, // This is just green.A700 as hex.
  },
})

const pieColors = {
  red: red[900],
  grey: grey[400],
  green: green[600],
}

export default theme
export { pieColors }
