const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET device/info', () => {
  const tempMac = faker.internet.mac();
  const tempName = faker.internet.userName();
  const { uuid, apiKey } = uuidApiKey.create();

  before(() => {
    // Register a temp device
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      uuid,
      apiKey,
    }).save();
  });

  it('it should GET the device information', (done) => {
    chai.request(app)
      .get(`/device/info?mac=${tempMac}`)
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.friendlyName).to.equal(tempName);
      });
    done();
  });

  after(() => { Device.deleteOne({ deviceId: tempMac }); });
});
