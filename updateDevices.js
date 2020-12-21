const config = require('./config.json')
const {findDeviceInNetwork, listNetworkDevices, longScan} = require('./networkScan')
const loadFromCloud = require('./loadDevices')
const ora = require('ora');
const {
  loadDevices,
  saveDevices,
  mergeDeviceLists,
  mergeDevicesInLists,
} = require('./common')
const Table = require('cli-table');
const cliProgress = require('cli-progress');


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

    const secondsToScan = 15
    const loadNetworkSpinner = ora(`0s/${secondsToScan}s scanning network for devices...`).start();
    const  startTime = Date.now().valueOf()
    try {
        const loader = setInterval(() => {
            const currentTime = Date.now().valueOf()
            const currentDiff = Math.round((currentTime - startTime) / 1000,0)
            loadNetworkSpinner.text = `${currentDiff}s/${secondsToScan}s scanning network for devices...`;
        }, 1000)

        const networkInfoList = await longScan(mergedDeviceList[0])
        clearInterval(loader)

        // const networkInfoList = await Promise.all(mergedDeviceList.map(findDeviceInNetwork))
        const bound = mergeDevicesInLists(mergedDeviceList, networkInfoList)
        const network = await listNetworkDevices(mergedDeviceList)
        saveDevices({bound, network})
        loadNetworkSpinner.succeed('Devices from network fetched and local List updated')
        const table = new Table({ head: ['id', 'ip', 'linked', 'reachable in network', 'updatedIP', 'online']})
        network.map(d => table.push(Object.values(d)))
        console.log('the following devices were found:');
        console.log(table.toString());
    } catch (error){
        loadNetworkSpinner.fail('Failed scanning network for devices');
        console.error(error);
    }
}
module.exports = updateConfig