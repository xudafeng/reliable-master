'use strict';

const Service = require('egg').Service;
const debug = require('debug')('reliable:service:build');

module.exports = class BuildService extends Service {
  async queryAllBuilds({ page, num }) {
    const ctx = this.ctx;
    const allJobName = await ctx.model.JobName.findAll({
      attributes: [
        'jobName',
      ],
    }).map(i => i.jobName);

    debug({
      limit: num,
      offset: (page - 1) * num,
      order: [
        [
          'createdAt',
          'DESC',
        ],
      ],
    });

    const total = await ctx.model.Build.count();

    const result = await ctx.model.Build.findAll({
      limit: num,
      offset: (page - 1) * num,
      order: [
        [
          'createdAt',
          'DESC',
        ],
      ],
    });

    return {
      success: true,
      message: '',
      data: {
        allJobName,
        total,
        page,
        result,
      },
    };
  }

  async queryByJobName({ page, num, jobName }) {
    const ctx = this.ctx;
    const allJobName = await ctx.model.JobName.findAll({
      attributes: [
        'jobName',
      ],
    }).map(i => i.jobName);
    const total = await ctx.model.Build.count();
    const result = await ctx.model.Build.findAll({
      limit: num,
      offset: (page - 1) * num,
      order: [
        [
          'createdAt',
          'DESC',
        ],
      ],
      where: {
        jobName,
      },
    });
    return {
      success: true,
      message: '',
      data: {
        allJobName,
        total,
        page,
        result,
      },
    };
  }

  async queryByJobNameAndBuildNumber({ jobName, buildNumber }) {
    const ctx = this.ctx;
    const build = await ctx.model.Build.findOne({
      where: {
        jobName,
        buildNumber,
      },
    });
    if (!build) {
      return {
        success: false,
        code: 'ERR_RELIABLE_BUILD_RECORD_NOT_FOUND',
      };
    }

    const result = build.get({ plain: true });
    return {
      success: true,
      message: '',
      data: result,
    };
  }

  async queryBuildByUniqId({ uniqId }) {
    return await this.ctx.model.Build.findOne({
      where: {
        uniqId,
      },
    }
    );
  }

  async updateBuild({ uniqId, payload }) {
    return await this.ctx.model.Build.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }

  async finishBuild({ uniqId, payload }) {
    return await this.ctx.model.Build.update(
      payload,
      {
        where: {
          uniqId,
        },
      }
    );
  }
};

