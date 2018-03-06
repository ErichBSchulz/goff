// curtesy of
// https://material-ui-next.com/demos/tables/
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import Checkbox from 'material-ui/Checkbox'
import Tooltip from 'material-ui/Tooltip'
//import IconButton from 'material-ui/IconButton'
//import FilterListIcon from 'material-ui-icons/FilterList'
import { lighten } from 'material-ui/styles/colorManipulator'
import ActionButtons from './ActionButtonView'


class EnhancedTableHead extends React.Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount } = this.props
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {this.props.meta.map(column => {
            return (
              <TableCell key={column.id}
                numeric={column.type !== 'text'}
                padding={column.padding ? 'default' : 'none'}
                sortDirection={orderBy === column.id ? order : false} >
                <Tooltip
                  title="Sort"
                  placement={column.type === 'numeric'
                    ? 'bottom-end'
                    : 'bottom-start'}
                  enterDelay={300} >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)} >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )}, this)}
            <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const toolbarStyles = theme => ({
  root: { paddingRight: theme.spacing.unit},
  highlight:
    theme.palette.type === 'light'
      ? { color: theme.palette.secondary.dark,
          backgroundColor: lighten(theme.palette.secondary.light, 0.4)}
      : { color: lighten(theme.palette.secondary.light, 0.4),
          backgroundColor: theme.palette.secondary.dark},
  spacer: { flex: '1 1 100%'},
  actions: { color: theme.palette.text.secondary},
  title: { flex: '0 0 auto'},
})

let EnhancedTableToolbar = props => {
  const { classes, heading,
      menu,
      handler,
      selected,
  } = props


  const numSelected = selected.length
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography variant="subheading">{numSelected} selected</Typography>
        ) : (
          <Typography variant="title">{heading}</Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <ActionButtons menu={menu} handler={handler} items={selected} />
        ) : ( ''
//          <Tooltip title="Filter list">
//            <IconButton aria-label="Filter list">
//              <FilterListIcon />
//            </IconButton>
//          </Tooltip>
        )}
      </div>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  root: { width: '100%', marginTop: theme.spacing.unit * 0},
  table: { minWidth: 400},
  tableWrapper: { overflowX: 'auto'},
})

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = props.startingState
    this.state.sortedData = props.data
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    const column = this.props.meta.find(n => n.id === property)
    // function to either calculate or lookup value
    const val = column.sortValue
      || column.value
      || (row => row[orderBy])
    const sort = (a, b) => ((order==='desc') === (val(b) < val(a))) ? -1 : 1
    const sortedData = this.props.data.slice().sort(sort)
    this.setState({sortedData, order, orderBy})
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.data.map(n => n.id) })
    }
    else {
      this.setState({ selected: [] })
    }
  }

  // update selected
  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) { // add item
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)) }
    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  cellValue = (column, row) => {
    const val = column.value ? column.value(row) : row[column.id]
    return column.type === 'numeric' && isNaN(val) ? '' : val
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  // calls the supplied action handler after looking up the id in the collection
  handler = (button, ids) => {
    const data = this.props.data
    const items = data.filter(row => ids.find(id => (id === row.id)))
    this.props.handler(button, items)
  }

  render() {
    const { classes } = this.props
    const { sortedData,
      order, orderBy, selected,
      rowsPerPage: rpp, page} = this.state
    const { heading, data,
      menu, meta} = this.props
    const emptyRows = rpp - Math.min(rpp, data.length - page * rpp)
    const colSpan = meta.length + 2
    const visibleRows = sortedData.slice(page*rpp, (page+1)*rpp)
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          heading={heading}
          menu={menu}
          handler={this.handler}
          selected={selected}
          />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              meta={meta}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map(sortedRow => {
                const row = data.find(r => r.id === sortedRow.id)
                const isSelected = this.isSelected(row.id)
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    {meta.map(column => { return (
                      <TableCell
                        numeric={column.type !== 'text'}
                        padding={column.padding ? 'default' : 'none'}
                        key={column.id}
                        >
                        {this.cellValue(column, row)}
                      </TableCell>
                    )}, this)}
                    <TableCell>
                      <ActionButtons
                        menu={menu}
                        handler={this.handler}
                        items={[row.id]} />
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={colSpan} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={colSpan}
                  count={data.length} rowsPerPage={rpp} page={page}
                  backIconButtonProps={{'aria-label': 'Previous Page'}}
                  nextIconButtonProps={{'aria-label': 'Next Page'}}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EnhancedTable)

