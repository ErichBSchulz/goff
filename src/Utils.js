import uuidv3 from 'uuid/v3'

// miscelaneous utils
const uuidNamespace = uuidv3.DNS
const uuid = (seed) => (uuidv3(seed, uuidNamespace))
// decorate an object with a UUID based on its title
const addId = (obj) => {
  obj.id = uuid(obj.title)
  return obj
}

const findById = (array, id) => {
  return array.find(e => {return e.id === id})
}

// join elemenets of array b into elements of array a
const joinById = (a, b) => {
  return a.map(ea =>
    Object.assign(ea, b.find(eb => {return eb.id === ea.id}))
  )
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
    let presentProxy = false;
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

// take obj[attributeCollection] and summs the values
// clones the new object, adding and attributeCollection + mood property
const summarise = (obj, attributeCollection, elements) => {
  const summary = {}
  const votes = obj[attributeCollection]
  for (const index in votes) {
    for (const prop in elements) {
      elements[prop] += (votes[index][prop] || 0)
    }
  }
  summary[attributeCollection + 'Summary'] = elements
  const result = Object.assign({}, obj, summary)
  return result
}

// take {item, voters, payload.action}
// returns a new item with the mood updated
const recordVotes = params => {
  const {item, voters, action} = params
  // merge these actions to create collection of updated moods by voters
  let moodUpdates = {}
  voters.forEach(voter => {
    const existingMood = (item.mood || {})[voter.userId]
    moodUpdates[voter.userId] = Object.assign({}, existingMood, action)
  })
  // add in new moods to existing mood
  const mood = Object.assign({}, item.mood, moodUpdates)
  // copy item
  return Object.assign({}, item, {mood})
}

export default {
  addId,
  joinById,
  currentVoters,
  allocateProxies,
  summarise,
  recordVotes,
}
