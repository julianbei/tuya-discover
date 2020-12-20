const yaml = require('js-yaml')
const {loadDevices} = require('./common')
const fs = require('fs');

const writeOutYaml = (data) => {
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync('./sockets.yaml', yamlStr, 'utf8');
}

const write = () => {
    const devices = loadDevices().bound.map(d => {
        return {
            host: d.ip,
            device_id: d.id,
            local_key: d.localKey,
            friendly_name: d.name,
            protocol_version: d.version,
            entities: [
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} Current`,
                    id: 18,
                    scaling: 0.1,
                    devices_class: 'current',
                    unit_of_measurement: 'mA'
                },
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} Current Consumption`,
                    id: 19,
                    scaling: 0.1,
                    devices_class: 'current_consumption',
                    unit_of_measurement: 'W'
                },
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} Current Voltage`,
                    id: 20,
                    scaling: 0.1,
                    devices_class: 'voltage',
                    unit_of_measurement: 'V'
                },
                { 
                    platform: 'switch',
                    friendly_name: `${d.name} Current`,
                    id: 1,
                },
            ]
        }
    })
    writeOutYaml(devices)
}
write()