const fs = require('fs')
const path = require('path')

const devicesDBFileName = path.join(__dirname, 'devices.json')

const loadDevices = () => {
  return JSON.parse(fs.readFileSync(devicesDBFileName))
}

const saveDevices = (devices) => {
    fs.writeFileSync(devicesDBFileName, JSON.stringify(devices, 0, 2))
}

const mergeDevicesInLists = (list1, list2) => list1.map((d) => ({...d, ...list2.find(ni => ni.id === d.id)}))

const mergeDeviceLists = (localList, cloudList) => {
  if(localList && localList.length) {
    const locallyKnownIds = localList.map(d => d.id)
    const newDevices = cloudList.filter(fc => !locallyKnownIds.includes(fc.id))
    const updatedDevices = localList.map((d) => {
        const remote = cloudList.find(r => d.id === r.id)
        if(!remote) return d;
        return {...d, ...remote}
    })
    return [...newDevices, ...updatedDevices]
  }
  return cloudList;
}

module.exports = {
    loadDevices,
    saveDevices,
    mergeDevicesInLists,
    mergeDeviceLists,
}