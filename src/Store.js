import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Utils from './Utils'

const actions = {
  USER: {
    JOIN: 'user/join',
    LEAVE: 'user/leave',
  },
  FORUM: {
    ADDITEM: 'item/create',
    ASSERT: 'item/assert', // asserts a position (helpful, unhelpful, agree, disagree)
  },
}

export const actionCreators = {
  addItem: (payload) => ({type: actions.FORUM.ADDITEM, payload}),
  assert: (payload) => ({type: actions.FORUM.ASSERT, payload}),
}

const testState = () => {
  const title = "Fish Friends AGM"
  const members = Utils.allocateProxies([
    {id: 2342, title: 'Abby', status: "present", proxyTo: [122445, 250851]},
    {id: 62345, title: 'Bill', status: "present", proxyTo: [2342, 122445, 250851]},
    {id: 97652, title: 'Charlie', status: "present", proxyTo: [2342, 122445, 250851]},
    {id: 122445, title: 'Doug', status: "absent", proxyTo: [2342, 250851]},
    {id: 244085, title: 'Enzo', status: "absent", proxyTo: [2342, 122445, 250851]},
    {id: 240851, title: 'Fill', status: "absent",},
    {id: 240853, title: 'Gina', status: "present", proxyTo: [2342, 122445, 250851]},
    {id: 240854, title: 'Gina', status: "present", proxyTo: [250851]},
  ])
  const forum = Utils.addId({
    title, members,
    items: [
    {id: 2, title: 'Treasurer\'s report'},
    {id: 6, title: 'secretarie\'s report'},
    {id: 23, title: 'convenors\'s report'},
    {id: 103, title: 'directors\' report'},
    ]
  })
  return {
    forum: forum,
    forums: [],
    session: {
      device: "Dougs's tablet",
      users: [
        {id: 2342, localStatus: 'active', },
        {id: 97652, localStatus: 'active',},
        {id: 122445, localStatus: 'connected', localOwner: true },
        ]
    },
  }
}

/*
 * Things you should never do inside a reducer:
 * Mutate its arguments;
 * Perform side effects like API calls and routing transitions;
 * Call non-pure functions, e.g. Date.now() or Math.random().
 */
// sub reducer
function users(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state
  }
}

// sub reducer
function forum(state = {}, action) {
  console.log('state', state)
  console.log('action', action)
  switch (action.type) {
    case actions.FORUM.ADDITEM: {
      let items = state.items.concat([action.payload])
        console.log('items', items)
      let newState = {...state, items}
      console.log('newState', newState)
      return newState
    }
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state
  }
}

// sub reducer
function forums(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map(
        (todo, index) =>
          action.index === index
            ? { text: todo.text, completed: !todo.completed }
            : todo
      )
    default:
      return state
  }
}

const reducer = combineReducers({ users, forum, forums })

export default function configureStore() {
  return createStore(
    reducer,
    testState(),
    applyMiddleware(thunk)
  )
}
