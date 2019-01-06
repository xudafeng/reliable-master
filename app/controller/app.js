'use strict';

const {
  Controller,
} = require('egg');
const debug = require('debug')('reliable:controller:app');

const DEFAULT_BRANCH_QUERY_DAYS_RANGE = 30;

class AppController extends Controller {
  async show() {
    const ctx = this.ctx;
    ctx.validate({
      bucketTag: { type: 'string' },
      type: { type: 'string' },
    }, ctx.query);
    debug(ctx.query);

    const Op = ctx.app.Sequelize.Op;
    const branches = await ctx.model.Build.findAll({
      where: {
        createdAt: {
          [Op.gte]: ctx.moment().subtract(DEFAULT_BRANCH_QUERY_DAYS_RANGE, 'days').toDate(),
        },
      },
      attributes: [ 'gitBranch', 'uniqId', 'createdAt' ],
      order: [[ 'createdAt', 'DESC' ]],
    });
    if (!branches.length) {
      return;
    }
    const uniqBranchMap = branches.reduce((map, branch) => {
      if (!(map.has(branch.gitBranch))) map.set(branch.gitBranch, branch.uniqId);
      return map;
    }, new Map());
    const buildUniqIds = Array.from(uniqBranchMap.values());

    const buildList = await ctx.model.Build.findAll({
      where: {
        uniqId: {
          [Op.in]: buildUniqIds,
        },
      },
      order: [
        [
          'createdAt',
          'DESC',
        ],
      ],
    });

    if (!buildList.length) {
      return;
    }

    const latestBuild = buildList[0];

    const builds = [];

    for (const build of buildList) {
      const data = build.get({ plain: true });
      let size;
      const packages = ctx.safeGet(data, 'data.packages') || [];
      if (packages.length) {
        const pkg = packages.find(i => i.type === type);
        size = pkg && pkg.size;
      }
      const appBuildData = {
        uniqId: data.uniqId,
        version: ctx.safeGet(data, 'data.packages[0].version'),
        size,
        gitBranch: data.gitBranch,
        gitCommitInfo: ctx.safeGet(data, 'data.gitCommitInfo'),
        testInfo: ctx.safeGet(data, 'data.testInfo'),
        extendInfo: data.extendInfo || {},
        state: data.state,
        createdAt: data.createdAt,
      };
      builds.push(appBuildData);
    }

    ctx.success({
      gitRepo: ctx.safeGet(latestBuild, 'data.gitCommitInfo.gitUrl'),
      builds,
    });
  }
}

module.exports = AppController;
