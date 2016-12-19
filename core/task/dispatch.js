'use strict';

const co = require('co');
const cluster = require('cluster');

const Slave = require('../slave');
const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const Task = models.Task;
const Project = models.Project;

module.exports = co.wrap(function *() {
  try {
    const task = new Task();
    const taskData = yield task.getExpectedOne();

    if (!taskData) {
      logger.debug('no queue');
      return;
    }

    const project = new Project();
    const projectData = yield project.getById(taskData.projectId);

    if (!projectData) {
      logger.debug('no projectData');
      return;
    }

    let body = `${projectData.repositoryUrl}#${projectData.repositoryBranch}`;

    process.send({
      message: 'dispatchTask',
      data: {
        body: body,
        taskId: taskData._id,
        type: 'task',
        runiOS: projectData.runiOS
      }
    });
  } catch (e) {
    logger.warn(e.stack);
  }
});

module.exports.success = co.wrap(function *(data, slave) {
  try {
    const task = new Task();
    yield task.updateById(data.taskId, {
      status: 1,
      slaveId: slave.sysInfo.hostname,
      start_at: Date.now()
    });
  } catch (e) {
    logger.warn(e.stack);
  }
});
