import uuidv3 from 'uuid/v3'

// miscelaneous utils
const uuidNamespace = uuidv3.DNS
const uuid = (seed) => (uuidv3(seed, uuidNamespace))
// decorate an object with a UUID based on its title
const addId = (obj) => {
  obj.id = uuid(obj.title)
  return obj
}

const pluralise = (n, singular = '', multiple = 's') => n === 1 ? singular : multiple
// cope with the weirdness of "1 loves, 2 love" - wtf English!
const inversePluralise = n => n === 1 ? 's' : ''

const toList = (array, sep = ', ', last = 'and') => {
  const len = array.length
  return array.reduce((s, a, i) => a + (i+1===len ? last : sep) + s)
}

const findById = (array, id) => {
  return array.find(e => {return e.id === id})
}

// create an object from an array keyed on an id column
const indexBy = (array, id = 'id') => {
  var index = {}
  array.forEach(item => {index[item[id]] = item})
  return index
}


// join elemenets of array b into elements of array a
const joinById = (a, b) => {
  return a.map(ea =>
    Object.assign(ea, b.find(eb => {return eb.id === ea.id}))
  )
}

// let values = [2, 56, 3, 41, 0, 4, 100, 23]
// median = 13,5
const median = values => {
  values.sort((a, b) => a - b)
  const i1 = Math.floor((values.length - 1) / 2)
  const i2 = Math.ceil((values.length - 1) / 2)
  return (values[i1] + values[i2]) / 2
}

// JSON.stringify replacer avoid circles
// thanks to https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json?rq=1
const stringify = (obj, replacer, indent=2) => {
  var po = [] // printed objects
  var pok = [] // printed object keys
  const printOnceReplacer = (key, value) => {
    if (po.length > 2000) { return 'object too long'}
    var printedObjIndex = false
    po.forEach((obj, index) => {
      if(obj===value) {printedObjIndex = index}
    })
    if (key === '') { //root element
      po.push(obj)
      pok.push("root")
      return value
    }
    else if (printedObjIndex+"" !== "false" && typeof(value)==="object"){
      if (pok[printedObjIndex] === "root"){
        return "(pointer to root)"
      } else if (value.id && value.title) {
        return '{#' + value.id + ' ' + value.title + '}'
      } else {
        const type = (!!value && !!value.constructor)
            ? value.constructor.name.toLowerCase()
            : typeof(value)
        return "(see " + type +  " with key " + pok[printedObjIndex] + ")"
      }
    } else {
      po.push(value)
      pok.push(key || "(empty key)")
      return replacer ? replacer(key, value) : value
    }
  }
  return JSON.stringify(obj, printOnceReplacer, indent)
}

// creates a denormalised version of the members state.
// looks up all the IDs in:
//   [votingFor]
//   [proxyTo]
//   activeProxy
const indexForumMembers = members => {
  var index = indexBy(members)
  members.forEach(member => {
    let indexed = {};
    ['votingFor', 'proxyTo'].forEach(k => {
      indexed[k+'Index'] = (member[k] || []).map(id => index[id])
    })
    indexed.activeProxyIndex = index[member.activeProxy]
    // copy new shallow copy and decorated object into index
    index[member.id] = Object.assign(indexed, member)
  })
  return index
}

//create a collection of {userId, viaUserId}
// based on the session user collection and localStatus property
const currentVoters = users => {
  const activeUsers =
    users
    .filter(user => user.localStatus === 'active')
    .reduce((active, user) => {
      user.votingFor.forEach(
          userId => active.push({userId, viaUserId: user.id}))
      return active
      }, [])
  return activeUsers
}

//creates a new members array
const allocateProxies = members => {
  // add votingFor fields
  const m = members.map(
      member => Object.assign({votingFor : []}, member)
  )
  const result = m.map(member => {
    let presentProxy = false
    // am I voting on behalf of myself?
    if (member.present) {
      presentProxy = member
    }
    else { // are any of my proxy's present
      if (member.proxyTo) {
        let latest = false // holds latest member object tested
        // find first available proxy
        const found = member.proxyTo.find(proxyId => {
          latest = findById(m, proxyId)
          return latest && latest.present
        })
        if (found) presentProxy = latest
      }
    }
    if (presentProxy) {
      presentProxy.votingFor.push(member.id)
      member.activeProxy = presentProxy.id
    }
    else {
      member.activeProxy = null
    }
    return member
  })
  return result
}

// take obj[attributeCollection] and sums the values
// clones the new object, adding and attributeCollection + mood property
const summarise = (obj, attributeCollection, meta) => {
  // iniatialise accumlators
  var summary = {}
  var tally = {}
  for (const prop in meta) {
    summary[prop] = meta[prop].mode === 'median' ? [] : 0
    tally[prop] = {}
  }
  // loop over votes and accumulate vaules per mode
  const votes = obj[attributeCollection]
  for (const index in votes) {
    for (const prop in meta) {
      const vote = votes[index][prop]
      tally[prop][vote] = (tally[prop][vote] || 0) + 1
      switch (meta[prop].mode) {
        case 'sum':
          summary[prop] += (vote || 0)
          break
        case 'median':
          if (typeof vote !== 'undefined') summary[prop].push(vote)
          break
        default:
          throw new Error('bad mode')
      }
    }
  }
  for (const prop in meta) {
    if (meta[prop].mode === 'median') summary[prop] = median(summary[prop])
  }
  const result = Object.assign({}, obj, {
    [attributeCollection + 'Summary']: summary,
    [attributeCollection + 'Tally']: tally
    })
  return result
}

// cluster a mood (indexed on memberid) to make a list of moods.
const cluster = (mood) => {
  let result = {}
  Object.keys(mood).forEach(id => { // id = 1234
    Object.keys(mood[id]).forEach(attribute => { // attribute = support
      if (!result[attribute]) result[attribute] = {}
      const value = mood[id][attribute] //
      if (!result[attribute][value]) result[attribute][value] = []
      result[attribute][value].push(id)
    })
  })
  return result
}

const timesUp = {1: 2, 2: 3, 3: 4, 4: 5, 5: 7, 7: 8, 8: 10, 10: 15, 15: 20, 20: 25, 25: 30,
  30: 40, 40: 50, 50: 60, 60: 70, 70: 80, 80: 90, 90: 120, 120: 150, 150: 180,
  180: 240, 240: 300, 300: 360, 360: 420, 420: 480}
const timesDown = ((o) => { // invert times up array
  let i = {}
  for (const k in o) i[o[k]] = Math.floor(k) // cast as int
  return i})(timesUp)

// add more or less to a number in a logarithmic scale
// uses timesUp and timesDown
const relativeChange = (action, current, defaultValue) => {
  const start = isNaN(current) ? defaultValue : current
  var result
  switch (action) {
    case 'more':
      result = timesUp[start] || Math.round(start * 1.3) + 1
      break
    case 'less':
      result = timesDown[start] || Math.max(Math.round(start / 1.3) - 1, 0)
      break
    default:
      throw new Error('bad action')
  }
  return result
}

// take {item, voters, payload.action}
// returns a new item with the mood updated
const recordVotes = params => {
  const {item, voters, action, meta} = params
  // merge these actions to create collection of updated moods by voters
  let moodUpdates = {}
  voters.forEach(voter => {
    const existingMood = ((item.mood || {})[voter.userId]) || {}
    let relativeActions = {}
    for (const field in action) {
      const fieldMeta = meta[field]
      if (fieldMeta.mode === 'median') {
        relativeActions[field] = relativeChange(action[field], existingMood[field], fieldMeta.defaultValue)
      }
      else {
        relativeActions[field] = action[field]
      }
    }
    moodUpdates[voter.userId] = Object.assign({}, existingMood, relativeActions)
  })
  // add in new moods to existing mood
  const mood = Object.assign({}, item.mood, moodUpdates)
  // copy item
  const finalItem = Object.assign({}, item, {mood})
  return finalItem
}

export default {
  // generic:
  pluralise,
  inversePluralise,
  toList,
  addId,
  joinById,
  stringify, // JSON replacer
  // application specifit
  currentVoters,
  allocateProxies,
  summarise,
  indexForumMembers,
  cluster, // reorganise a mood list to make arrays of ids
  recordVotes,
}
