import uuidv3 from 'uuid/v3'

// miscelaneous utils
const uuidNamespace = uuidv3.DNS
const uuid = (seed) => (uuidv3(seed, uuidNamespace))
// decorate an object with a UUID based on its title
const addId = (obj) => {
  obj.id = uuid(obj.title)
  return obj
}


export default {addId}
