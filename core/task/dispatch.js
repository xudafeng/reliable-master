/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

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

  let body = projectData.repositoryUrl;

  body += `#${projectData.repositoryBranch}`;

  process.send({
    message: 'dispatch',
    data: {
      body: body,
      taskId: taskData._id,
      type: 'task'
    }
  });
});

module.exports.success = co.wrap(function *(data, slave) {
  const task = new Task();
  yield task.updateById(data.taskId, {
    status: 1,
    slaveId: slave.sysInfo.hostname,
    start_at: Date.now()
  });
});
