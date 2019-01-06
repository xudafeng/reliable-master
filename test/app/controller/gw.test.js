'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

const postData = require('../../fixtures/post-gw.json');

describe('test/app/controller/gw.test.js', () => {

  beforeEach(async () => {
    app.mockService('webhook', 'pushBuildNotification', {});
    await app.model.Build.destroy({
      where: {},
    });
    await app.model.JobName.destroy({
      where: {},
    });
  });

  it('POST /api/gw success', async () => {
    const { header, body } = await app.httpRequest()
      .post('/api/gw')
      .send(postData);
    assert(header['content-type'] === 'application/json; charset=utf-8');
    assert(body.success);
    const data = body.data;
    assert(data.uniqId);
    assert.deepStrictEqual(data.data, postData);
    assert(data.buildNumber === '11');
    assert(data.jobName === 'jobName');
  });

  it('POST /api/gw with INIT state', async () => {
    const { header, body } = await app.httpRequest()
      .post('/api/gw')
      .send(Object.assign({}, postData, {
        testInfo: {},
        extraInfo: {},
        packages: [],
        files: [],
      }));
    assert(header['content-type'] === 'application/json; charset=utf-8');
    assert(body.success);
    const data = body.data;
    assert(data.uniqId);
    assert(data.buildNumber === '11');
    assert.deepStrictEqual(data.data.files, []);
    assert(data.jobName === 'jobName');

    const { header: updateHeader, body: updateBody } = await app.httpRequest()
      .post('/api/gw')
      .send(postData);
    assert(updateHeader['content-type'] === 'application/json; charset=utf-8');
    assert.deepStrictEqual(updateBody, {
      success: true,
      data: [ 1 ],
    });
  });

  it('POST /api/gw error', async () => {
    const { header, body } = await app.httpRequest()
      .post('/api/gw')
      .send(Object.assign({}, postData, { environment: {} }));
    assert(header['content-type'] === 'application/json; charset=utf-8');
    assert(body.success === false);
    assert(body.message === 'environment.ci.JOB_NAME and environment.ci.BUILD_NUMBER are required.');
  });
});
