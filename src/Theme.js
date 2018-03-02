import { createMuiTheme } from 'material-ui/styles'
import purple from 'material-ui/colors/purple'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#11cb5f' }, // Purple and green play nicely together.
    secondary: { main: purple[500] }, // This is just green.A700 as hex.
  },
})

export default theme
