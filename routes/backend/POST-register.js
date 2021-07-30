const uuidApiKey = require('uuid-apikey');

const jwtVerify = require('../../middleware/jwtVerify');
const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/register', jwtVerify, (req, res) => {
    const { deviceId, friendlyName } = req.body;
    if (!deviceId || !deviceId.match(/([0-9A-Fa-f]{2}){6}/) || !friendlyName) return res.status(400).json({ error: 'Bad Request' });
    const { uuid, apiKey } = uuidApiKey.create();

    new Device({
      deviceId: deviceId.toLowerCase(),
      friendlyName,
      uuid,
      apiKey,
    }).save().then(() => res.status(200).json({ apiKey }));
  });
};
