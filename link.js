const TuyaLink = require('@tuyapi/link').wizard;
const ora = require('ora');
const config = require('./config.json')
const updateConfig = require("./updateDevices")
const prompt = require('prompt-promise');
const API = require('@tuyapi/openapi');

async function link(options) {

    const link = new TuyaLink({
        apiKey: options.apiKey,
        apiSecret: options.apiSecret,
        email: 'johndoe@example.com',
        password: 'examplepassword',
        schema: options.schema,
        region: options.region,
        timezone: options.timezone || 'America/Chicago'
    });
    const api = new API({key: options.apiKey, secret: options.apiSecret, schema: options.schema, region: options.region});
    await api.getToken();

    console.log('linking devices...')
    const spinner = ora('Registering devices(s)...').start();
    let deviceDetails = false
    try {
        await link.init();
        const devices = await link.linkDevice({ssid: options.ssid, wifiPassword: options.password, devices: options.num});
        spinner.succeed('Device registered!');
        deviceDetails = (await api.getDevices({ids: devices.map(d => d.id)})).devices;

    } catch (error) {
		spinner.fail('Device failed to be registered!');
        console.error(error);
    }
    if(deviceDetails){
        // console.log(deviceDetails);
        // const name = await prompt(`What's the device name?`)
        // const result = await api.changeDeviceName(deviceDetails.id, name)
        // console.log((result));
        await updateConfig()
    }
}

link(config)