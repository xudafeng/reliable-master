'use strict';

const {
  app,
  assert,
} = require('egg-mock/bootstrap');

const { delay } = require('../../util');
const postData = require('../../fixtures/post-gw.json');

async function insertData(customData = {}) {
  return await app.httpRequest()
    .post('/api/gw')
    .send(Object.assign({}, postData, customData));
}

describe('test/app/controller/app.test.js', function() {

  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
    app.mockService('webhook', 'pushBuildNotification', {});
  });

  it('GET /api/app/:appId with empty deploy result and change build extraInfo', async () => {
    const appId = 'APP_ONE';
    await app.model.Config.create({
      data: {},
    });
    // await app.model.Credential.create({
    //   provider: 'ALIYUN_OSS',
    //   bucketTag: 'dev',
    //   region: 'region',
    //   bucket: 'bucket',
    //   namespace: 'namespace',
    //   accessKeyId: 'accessKeyId',
    //   accessKeySecret: 'accessKeySecret',
    // });
    await insertData({
      gitCommitInfo: {
        gitBranch: 'feat/one',
        gitUrl: 'http://domain/url/one',
      },
      extraInfo: {
        appId,
      },
      environment: {
        ci: {
          RUNNER_TYPE: 'GITLAB_CI',
          JOB_NAME: 'jobName',
          BUILD_NUMBER: '11',
        },
        platform: 'web',
      },
    });

    await delay(1000);

    const { body: { data: { uniqId: buildUniqId } } } = await insertData({
      gitCommitInfo: {
        gitBranch: 'feat/two',
        gitUrl: 'http://domain/url/two',
      },
      extraInfo: {
        appId,
      },
      environment: {
        ci: {
          RUNNER_TYPE: 'GITLAB_CI',
          JOB_NAME: 'jobName',
          BUILD_NUMBER: '12',
        },
        platform: 'web',
      },
    });
    await ctx.model.JobName.bulkCreate([{
      jobName: 'android',
    }, {
      jobName: 'ios',
    }]);
    const { body: updateRes } = await app.httpRequest()
      .put(`/api/build/${buildUniqId}`)
      .send({
        extendInfo: {
          key: 'value',
        },
      });
    assert.deepStrictEqual(updateRes, {
      success: true,
      data: [ 1 ],
    });
    const { body: queryResult } = await app.httpRequest()
      .get(`/api/app/${appId}?bucketTag=dev&type=type1`);
    assert(queryResult.success);
    assert(queryResult.data.appId === appId);
    assert(queryResult.data.gitRepo === 'http://domain/url/two');
    assert(queryResult.data.builds.length === 2);
    assert(queryResult.data.builds[0].uniqId.length === 36);
    assert(queryResult.data.builds[0].version === '1.0.0');
    assert(queryResult.data.builds[0].gitBranch === 'feat/two');
    assert(queryResult.data.builds[0].deploy === null);
    assert(queryResult.data.builds[0].reliableDeployUrl === 'http://127.0.0.1/buildinfo?jobName=jobName&buildNumber=12');
    assert(queryResult.data.builds[0].state === 'SUCCESS');
    assert.deepStrictEqual(queryResult.data.builds[0].extendInfo, {
      key: 'value',
    });
    assert.deepStrictEqual(queryResult.data.builds[0].gitCommitInfo, {
      gitUrl: 'http://domain/url/two',
      gitBranch: 'feat/two',
    });
    assert.deepStrictEqual(queryResult.data.builds[0].testInfo, {
      tests: 16,
      passes: 16,
      linePercent: 95.24,
      passPercent: 100,
      testHtmlReporterPath: 'http://host/index.html',
      coverageHtmlReporterPath: 'http://host/index.html',
    });
    assert.deepStrictEqual(queryResult.data.builds[1].extendInfo, {});
  });

  it('GET /api/app/:appId contains deploy result', async () => {
    const appId = 'APP_ONE';
    app.mockService('deployAliyunOss', 'deploy', {
      success: true,
      message: '',
      uploadResult: {
        other: [{
          url: 'https://github.com/a.zip',
        }],
      },
    });
    await app.model.Config.create({
      data: {},
    });
    const { uniqId: credentialUniqId } = await app.model.Credential.create({
      provider: 'ALIYUN_OSS',
      bucketTag: 'dev',
      region: 'region',
      bucket: 'bucket',
      namespace: 'namespace',
      accessKeyId: 'accessKeyId',
      accessKeySecret: 'accessKeySecret',
    });
    const { body: { data: { uniqId: buildUniqId } } } = await insertData({
      gitCommitInfo: {
        gitBranch: 'feat/two',
        gitUrl: 'http://domain/url/two',
      },
      extraInfo: {
        appId,
      },
    });
    await app.httpRequest()
      .post('/api/deploy')
      .send({
        type: 'type1',
        buildUniqId,
        credentialSecret: 'accessKeySecret',
        credentialUniqId,
      });
    const { body: queryResult } = await app.httpRequest()
      .get(`/api/app/${appId}?bucketTag=dev&type=type1`);
    assert(queryResult.success);
    assert(queryResult.data.appId === appId);
    assert(queryResult.data.gitRepo === 'http://domain/url/two');
    assert(queryResult.data.builds.length === 1);
    assert(queryResult.data.builds[0].state === 'SUCCESS');
    assert.deepStrictEqual(queryResult.data.builds[0].extendInfo, {});
    assert.deepStrictEqual(queryResult.data.builds[0].deploy, {
      package: {
        url: 'https://github.com/a.zip',
      },
    });
  });

  it('GET /api/app/:appId contains customDomain deploy result', async () => {
    const appId = 'APP_ONE';
    app.mockService('deployAliyunOss', 'deploy', {
      success: true,
      message: '',
      uploadResult: {
        other: [{
          url: 'https://github.com/a.zip',
        }],
      },
    });
    await app.model.Config.create({
      data: {},
    });
    const { uniqId: credentialUniqId } = await app.model.Credential.create({
      provider: 'ALIYUN_OSS',
      bucketTag: 'dev',
      region: 'region',
      bucket: 'bucket',
      namespace: 'namespace',
      accessKeyId: 'accessKeyId',
      accessKeySecret: 'accessKeySecret',
      customDomainProtocal: 'https://',
      customDomain: 'github.io',
    });
    const { body: { data: { uniqId: buildUniqId } } } = await insertData({
      gitCommitInfo: {
        gitBranch: 'feat/two',
        gitUrl: 'http://domain/url/two',
      },
      extraInfo: {
        appId,
      },
    });
    await app.httpRequest()
      .post('/api/deploy')
      .send({
        type: 'type1',
        buildUniqId,
        credentialSecret: 'accessKeySecret',
        credentialUniqId,
      });
    const { body: queryResult } = await app.httpRequest()
      .get(`/api/app/${appId}?bucketTag=dev&type=type1`);
    assert(queryResult.success);
    assert(queryResult.data.appId === appId);
    assert(queryResult.data.gitRepo === 'http://domain/url/two');
    assert(queryResult.data.builds.length === 1);
    assert.deepStrictEqual(queryResult.data.builds[0].extendInfo, {});
    assert.deepStrictEqual(queryResult.data.builds[0].deploy, {
      package: {
        url: 'https://github.io/a.zip',
      },
    });
  });
});
