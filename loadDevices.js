const API = require('@tuyapi/openapi');

const loadFromCloud = async (options) => {
    const api = new API({key: options.apiKey, secret: options.apiSecret, schema: options.schema, region: options.region});
    await api.getToken();
    const response = await api.getDevices()
    return response.devices
}

module.exports = loadFromCloud