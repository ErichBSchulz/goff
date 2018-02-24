import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import uuidv3 from 'uuid/v3'
const uuidNamespace = uuidv3.DNS
const uuid = (seed) => (uuidv3(seed, uuidNamespace))
// decorate an object with a UUID based on its title
const addId = (obj) => {
  obj.id = uuid(obj.title)
  return obj
}

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
  const forum = addId({
    title: title,
    items: [
    {id: 2, title: 'Treasurer\'s report'},
    {id: 6, title: 'secretarie\'s report'},
    {id: 23, title: 'convenors\'s report'},
    {id: 103, title: 'directors\' report'},
    ]
  })
  const users = [
    {id: 2342, title: 'Abby'},
    {id: 62345, title: 'Bill'},
  ]
  return {
    users: users,
    forum: forum,
    forums: [],
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
      let items = state.items.concat([addId({title: action.payload.title})])
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
