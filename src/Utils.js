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

//creates a new members array
const allocateProxies = members => {
  console.log('members', members)
  // add votingFor fields
  const m = members.map(
      member => Object.assign({votingFor : []}, member)
  )
  const result = m.map(member => {
    let presentProxy = false;
    // am I voting on behalf of myself?
    if (member.status === "present") {
      presentProxy = member
    }
    else { // are any of my proxy's present
      if (member.proxyTo) {
        let latest = false // holds latest member object tested
        const found = member.proxyTo.find(proxyId => {
          latest = findById(m, proxyId)
          return latest && latest.status === "present"
        })
        if (found) presentProxy = latest
      }
    }
    if (presentProxy) {
      console.log('presentProxy', presentProxy)
      presentProxy.votingFor.push(member.id)
      member.activeProxy = presentProxy.id
    }
    else {
      member.activeProxy = null
    }
    return member
  })
  console.log('result', result)
  return result
}

export default {
  addId,
  allocateProxies,
}
