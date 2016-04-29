'use strict';

const url = require('url');

const models = require('../../../common/models');
const _ = require('../../../common/utils/helper');

const Task = models.Task;
const Project = models.Project;

function *getTaskTotalCountAndSuccessedCountByProjectId(projectId) {
  const task = new Task();

  return {
    data: {
      totalCount: yield task.getTotalCountByProjectId(projectId),
      successedCount: yield task.getSuccessedCountByProjectId(projectId)
    },
    success: true
  };
}

function *getTaskScheduleFromNowByProjectId(projectId, step) {
  const task = new Task();

  return {
    data: {
      schedule: yield task.getScheduleFromNowByProjectId(projectId, step)
    },
    success: true
  };
}

function *getTaskScheduleFromNow(step) {
  const task = new Task();

  return {
    data: {
      schedule: yield task.getScheduleFromNow(step),
      count: yield task.getTaskTotalCountFromStep(step)
    },
    success: true
  };
}

function *dispatch() {
  switch (this.query.type) {
    case 'getTaskTotalCountAndSuccessedCountByProjectId':
      this.body = yield getTaskTotalCountAndSuccessedCountByProjectId(this.query.id);
      break;
    case 'getTaskScheduleFromNowByProjectId':
      this.body = yield getTaskScheduleFromNowByProjectId(this.query.id, this.query.step);
      break;
    case 'getTaskScheduleFromNow':
      this.body = yield getTaskScheduleFromNow(this.query.step);
      break;
  }
}

module.exports = dispatch;
