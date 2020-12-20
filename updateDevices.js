const config = require('./config.json')
const {findDeviceInNetwork, listNetworkDevices} = require('./networkScan')
const loadFromCloud = require('./loadDevices')
const ora = require('ora');
const {
  loadDevices,
  saveDevices,
  mergeDeviceLists,
  mergeDevicesInLists,
} = require('./common')

const updateConfig = async () => {
    let devicesFromCloudAPI = []

    const loadCloudSpinner = ora('Loading registered devices(s)...').start();
    try {
        devicesFromCloudAPI = await loadFromCloud(config)
    if(devicesFromCloudAPI.length === 0) throw new Error('no devices fetched from cloud API')
        loadCloudSpinner.succeed('Devices fetched!');
    } catch (error){
        loadCloudSpinner.fail('Failed fetching devices from cloud');
        console.error(error);
    }

    const devicesFromLocalFile = loadDevices()
    const mergedDeviceList = mergeDeviceLists(devicesFromLocalFile.bound, devicesFromCloudAPI)

    const loadNetworkSpinner = ora('scanning network for devices...').start();
    try {
        const networkInfoList = await Promise.all(mergedDeviceList.map(findDeviceInNetwork))
        const bound = mergeDevicesInLists(mergedDeviceList, networkInfoList)
        const network = await listNetworkDevices(mergedDeviceList)
        saveDevices({bound, network})
        loadNetworkSpinner.succeed('Devices from network fetched and local List updated')
    } catch (error){
        loadNetworkSpinner.fail('Failed scanning network for devices');
        console.error(error);
    }
}
module.exports = updateConfig