'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

describe('test/app/controller/config.test.js', () => {

  beforeEach(() => {
    app.mockService('webhook', 'pushBuildNotification', {});
  });

  async function assertConfig(app, data) {
    const res = await app.httpRequest()
      .get('/api/config');
    assert.deepStrictEqual(res.body, data);
  }

  it('POST /api/config create and update', async () => {
    await assertConfig(app, {
      success: true,
      data: {},
    });

    let res = await app.httpRequest()
      .post('/api/config')
      .send({
        type: 'webhooks',
        webhooks: [ 'url-1', 'url-2' ],
      });
    assert.deepStrictEqual(res.body, {
      success: true,
      data: {},
    });
    await assertConfig(app, {
      success: true,
      data: {
        type: 'webhooks',
        webhooks: [ 'url-1', 'url-2' ],
      },
    });

    res = await app.httpRequest()
      .post('/api/config')
      .send({
        type: 'webhooks',
        webhooks: [ 'url-3', 'url-4' ],
      });
    assert.deepStrictEqual(res.body, {
      success: true,
      data: {},
    });
    await assertConfig(app, {
      success: true,
      data: {
        type: 'webhooks',
        webhooks: [ 'url-3', 'url-4' ],
      },
    });
  });
});
