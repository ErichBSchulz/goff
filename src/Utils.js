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

export default {
  addId,
  joinById,
  allocateProxies,
}
