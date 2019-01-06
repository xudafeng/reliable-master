'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

const postData = require('../../fixtures/post-gw.json');

async function insertData(customData = {}) {
  return await app.httpRequest()
    .post('/api/gw')
    .send(Object.assign({}, postData, customData));
}

describe('test/app/controller/insight.test.js', function() {

  beforeEach(() => {
    app.mockService('webhook', 'pushBuildNotification', {});
  });

  it('GET /api/insight/ci query ci data', async () => {
    await insertData({
      environment: {
        ci: {
          RUNNER_TYPE: 'GITLAB_CI',
          JOB_NAME: 'android_app',
          BUILD_NUMBER: '1',
        },
        platform: 'android',
        os: {
          nodeVersion: 'v1.1.2',
          platform: 'linux',
        },
      },
    });

    await insertData({
      environment: {
        ci: {
          RUNNER_TYPE: 'GITLAB_CI',
          JOB_NAME: 'ios_app',
          BUILD_NUMBER: '1',
        },
        platform: 'ios',
        os: {
          nodeVersion: 'v1.1.2',
          platform: 'linux',
        },
      },
    });

    const { body } = await app.httpRequest()
      .get('/api/insight/ci');
    assert.deepStrictEqual(body, {
      success: true,
      data: [{
        jobName: 'android_app',
        linePercent: 95.24,
        passPercent: 100,
        lastCommit: { committer: 'user', shortHash: 'ecb4bac', commitUrl: 'http://host/group/repo/commit/ecb4bac' },
        humanizeDuration: 0,
        linePercentList: [{
          commitUrl: 'http://host/group/repo/commit/ecb4bac',
          shortHash: 'ecb4bac',
          coverageUrl: 'http://host/index.html',
          linePercent: 95.24,
          createdAt: 'a few seconds ago',
        }],
        passPercentList: [{
          commitUrl: 'http://host/group/repo/commit/ecb4bac',
          shortHash: 'ecb4bac',
          reporterUrl: 'http://host/index.html',
          passPercent: 100,
          createdAt: 'a few seconds ago',
        }],
        durationList: [],
      }, {
        jobName: 'ios_app',
        linePercent: 95.24,
        passPercent: 100,
        lastCommit: {
          committer: 'user',
          shortHash: 'ecb4bac',
          commitUrl: 'http://host/group/repo/commit/ecb4bac',
        },
        humanizeDuration: 0,
        linePercentList: [{
          commitUrl: 'http://host/group/repo/commit/ecb4bac', shortHash: 'ecb4bac', coverageUrl: 'http://host/index.html', linePercent: 95.24, createdAt: 'a few seconds ago' },
        ],
        passPercentList: [{
          commitUrl: 'http://host/group/repo/commit/ecb4bac', shortHash: 'ecb4bac', reporterUrl: 'http://host/index.html', passPercent: 100, createdAt: 'a few seconds ago',
        }],
        durationList: [],
      }],
    });
  });
});
