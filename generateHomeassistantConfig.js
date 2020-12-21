const yaml = require('js-yaml')
const {loadDevices} = require('./common')
const fs = require('fs');

const writeOutYaml = (data) => {
    let yamlStr = yaml.safeDump(data);
    fs.writeFileSync('./sockets.yaml', yamlStr, 'utf8');
}

const measurementProducts = [
    'Smart Socket-16A',
    'Smart Socket-10A'
]

const write = () => {
    const devices = loadDevices().bound.map(d => {
        let newDevice = {
            host: d.ip,
            device_id: d.id,
            local_key: d.local_key,
            friendly_name: d.name,
            protocol_version: d.version || "3.1",
            entities: [
                { 
                    platform: 'switch',
                    friendly_name: `${d.name}`,
                    id: 1,
                },
            ]
        }

        if(measurementProducts.includes(d.product_name)) {
            newDevice.entities = [
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} current`,
                    id: 18,
                    scaling: 0.1,
                    device_class: 'current',
                    unit_of_measurement: 'mA'
                },
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} power Consumption`,
                    id: 19,
                    scaling: 0.1,
                    device_class: 'power',
                    unit_of_measurement: 'W'
                },
                { 
                    platform: 'sensor',
                    friendly_name: `${d.name} voltage`,
                    id: 20,
                    scaling: 0.1,
                    device_class: 'voltage',
                    unit_of_measurement: 'V'
                },
                ...newDevice.entities
            ]
        }
        return newDevice
    })

    writeOutYaml(devices)
}
write()