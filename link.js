const TuyaLink = require('@tuyapi/link').wizard;
const ora = require('ora');
const API = require('@tuyapi/openapi');
const {prettyDevices} = require('./common')
const config = require('./config.json')

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
    console.log('linking devices...')
    const spinner = ora('Registering devices(s)...').start();

    try {
        await link.init();
        await link.linkDevice({ssid: options.ssid, wifiPassword: options.password, devices: options.num});
        spinner.succeed('Device(s) registered!');
    } catch (error) {
		spinner.fail('Device(s) failed to be registered!');
        console.error(error);
    }
}

link(config)