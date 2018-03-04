import {
  combineReducers,
  createStore,
//  applyMiddleware
} from 'redux'
import Utils from './Utils'

const ForumItemMeta = {
  support: {mode: 'sum'},
  love: {mode: 'sum'},
  timeAllowance: {mode: 'median', defaultValue: 10},
}

const actions = {
  ITEM: {
    SET: 'item/set',
  },
  USER: {
    JOIN: 'user/join',
    LEAVE: 'user/leave',
    TOGGLELOCALSTATUS: 'user/togglelocalstatus',
  },
  FORUM: {
    ADDITEM: 'item/create',
    ASSERTITEM: 'item/assert', // asserts a position (helpful, unhelpful, agree, disagree)
  },
}

export const actionCreators = {
  toggleUserLocalStatus: (payload) => (
                             {type: actions.USER.TOGGLELOCALSTATUS, payload}),
  addItem: (payload) => ({type: actions.FORUM.ADDITEM, payload}),
  setItem: (payload) => ({type: actions.ITEM.SET, payload}),
  assertItem: (payload) => ({type: actions.FORUM.ASSERTITEM, payload}),
}

const testState = () => {
  const title = "Friends AGM"
  const members = Utils.allocateProxies([
    {id: 2342, title: 'Abby', present: true, proxyTo: [122445, 250851]},
    {id: 62345, title: 'Bill', present: true, proxyTo: [2342, 122445, 250851]},
    {id: 97652, title: 'Charlie', present: true, proxyTo: [2342, 122445, 250851]},
    {id: 122445, title: 'Doug', present: false, proxyTo: [2342, 250851]},
    {id: 244085, title: 'Enzo', present: false, proxyTo: [2342, 122445, 250851]},
    {id: 240851, title: 'Fill', present: false,},
    {id: 240853, title: 'Gina', present: true, proxyTo: [2342, 122445, 250851]},
    {id: 240854, title: 'Heather', present: true, proxyTo: [250851]},
  ])
  const users = Utils.joinById([
        {id: 2342, localStatus: 'active', },
        {id: 97652, localStatus: 'active',},
        {id: 122445, localStatus: 'connected', localOwner: true },
        ], members)
  const items = [
    Utils.addId({ title: 'Treasurer\'s report',
      details: 'Update on financial position after recent election',
      mood: {
        240851: {support: 1, love: 1, timeAllowance: 10},
        240853: {support: 1, love: 1, timeAllowance: 10},
        240854: {support: 1, love: 1, timeAllowance: 50},
      },
      motions: [Utils.addId({
        title: 'Accept report',
        details: 'That the treasurer\'s report be accepted',
        movedBy: [62345], secondedBy: [244085]}),
       ]
    }),
    Utils.addId({ title: 'Secretary\'s report',
      motions: [
        Utils.addId({
          title: 'Accept report',
          details: 'That the secretaries\'s report be accepted',
          movedBy: [62345], secondedBy: [244085]}),
        Utils.addId({
          title: 'Appoint assistant',
          details: 'That the Sam be appointed as assitant secretary',
          movedBy: [], secondedBy: []}),
      ]
    }),
    Utils.addId({ title: 'Convenors\'s report'}),
    Utils.addId({ title: 'Directors\' report'}),
    ].map(item => Utils.summarise(
          item, 'mood', ForumItemMeta))
  const forum = Utils.addId({title, members, items})
  return {
    session: {device: "Dougs's tablet", users}, // local information
    forums: [], // list of active forums
    forum, // the current forum
    item: forum.items[0],
    index: { // denormalised
      members: Utils.indexForumMembers(members),
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
function session(state = [], action) {
  switch (action.type) {
    case actions.USER.TOGGLELOCALSTATUS: {
      const toggle = state => state === 'active' ? 'connected' : 'active'
      const users = state.users.map(
        user =>
          // todo extract out this function that modifies single value in collection
          (user.id === action.payload.id
          ? {...user, localStatus: toggle(user.localStatus)}
          : user)
        )
      const newState = {...state, users }
      return newState
    }
    case 'blah':
      return state
    default:
      return state
  }
}


// sub reducer
function item(state = {}, action) {
  switch (action.type) {
    case actions.ITEM.SET: {
      state = {...action.payload.item}
      return state
    }
    default:
      return state
  }
}

// sub reducer
function forum(state = {}, action) {
  const payload = action.payload
  switch (action.type) {
    case actions.FORUM.ADDITEM: {
      const items = state.items.concat([payload])
      const newState = {...state, items}
      return newState
    }
    case actions.FORUM.ASSERTITEM: {
      const items = state.items.map(item =>
          item.id === payload.itemId
          ? Utils.summarise(
              Utils.recordVotes(
                {item,
                 voters: payload.voters,
                 action: payload.action,
                 meta: ForumItemMeta}),
              'mood', ForumItemMeta)
          : item)
      const newState = {...state, items}
      return newState
    }
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

// sub reducer
function index(state = [], action) {
  return state
}

const reducer = combineReducers({
  session,
  forums,
  forum,
  item,
  index,
})

export default function configureStore() {
  return createStore(
    reducer,
    testState(),
//    applyMiddleware(thunk)
  )
}
