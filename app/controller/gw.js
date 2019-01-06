'use strict';

const {
  Controller,
} = require('egg');
const debug = require('debug')('reliable:controller:gw');

const {
  BUILD_STATE_INIT,
  BUILD_STATE_SUCCESS,
} = require('../constants/build');

class GwController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { state = BUILD_STATE_SUCCESS, ...data } = ctx.request.body;
    // TODO remove
    const jobName = ctx.safeGet(data, 'environment.ci.JOB_NAME')
      || ctx.safeGet(data, 'environment.gitlab_ci.JOB_NAME');
    const buildNumber = ctx.safeGet(data, 'environment.ci.BUILD_NUMBER')
      || ctx.safeGet(data, 'environment.gitlab_ci.BUILD_NUMBER');
    if (!jobName || !buildNumber) {
      ctx.fail('ERR_RELIABLE_INVALID_PARAM_ERROR', 'environment.ci.JOB_NAME and environment.ci.BUILD_NUMBER are required.');
      return;
    }
    const gitBranch = ctx.safeGet(data, 'gitCommitInfo.gitBranch');
    if (!gitBranch) {
      ctx.fail('ERR_RELIABLE_INVALID_PARAM_ERROR', 'gitCommitInfo.gitBranch is required.');
      return;
    }
    debug('jobName %s, buildNumber %s', jobName, buildNumber);
    await ctx.model.JobName.findOrCreate({
      where: {
        jobName,
      },
      defaults: {
        jobName,
      },
    });

    let upsertResult = {};

    const build = await ctx.model.Build.findOne({
      where: {
        buildNumber,
        jobName,
      },
    });

    if (build) {
      debug('update build to finished', build.uniqId);
      upsertResult = await ctx.service.build.finishBuild({
        uniqId: build.uniqId,
        payload: {
          buildNumber,
          jobName,
          gitBranch,
          data,
          state,
          finishedAt: Date.now(),
        },
      });
    } else {
      debug('insert new build');
      upsertResult = await ctx.model.Build.create({
        buildNumber,
        jobName,
        gitBranch,
        data,
        state,
      });
    }

    if (state !== BUILD_STATE_INIT) {
      await ctx.service.webhook.pushBuildNotification(data);
    }
    ctx.success(upsertResult);
  }
}

module.exports = GwController;
