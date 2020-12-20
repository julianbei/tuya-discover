const TuyAPI = require('tuyapi');

const findDeviceInNetwork = async ({id, localKey}) => {
  const device = new TuyAPI({id, key: localKey})
  await device.find()
  const {parser, ...d } = device.device
  return d
}

const listNetworkDevices = async (knownDevices) => {
    const {id, localKey} = knownDevices[0]
    const device = new TuyAPI({id, key: localKey})
    await device.find()

    const localList = knownDevices.map(d => d.id)
    const networklist = device.foundDevices.map(d => d.id)
    const notFound = knownDevices
        .filter(f => !networklist.includes(f.id))
        .map(d => ({...d, known: knownDevices.find(r => r.id === d.id)}))
        .map(d => ({id: d.id, ip: null, linked: true, reachable: false, updatedIP: false, online: d.known.online }))

    const unkown = device.foundDevices
        .filter(f => !localList.includes(f.id))
        .map(d => ({id: d.id, ip: d.ip, linked: false, reachable: true, updatedIP: null, online: null }))

    const found = device.foundDevices
        .filter(f => localList.includes(f.id))
        .map(d => ({...d, known: knownDevices.find(r => r.id === d.id)}))
        .map(d => ({
            id: d.id, 
            ip: d.ip,
            linked: true, 
            reachable: true, 
            updatedIP: (d.known.ip !== d.ip),
            online: d.known.online
        }))
    
    return [
        ...notFound,
        ...found,
        ...unkown
    ]    
}

module.exports = {
    findDeviceInNetwork,
    listNetworkDevices
}