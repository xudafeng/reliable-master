

'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const Task = models.Task;
const Project = models.Project;

function *createTask(data) {
  const task = new Task();
  task.projectId = data._id;

  if (yield task.add()) {
    logger.debug('insert new project queue record');
  } else {
    logger.warn('insert new project failed');
  }
}

module.exports = co.wrap(function *() {
  const task = new Task();
  const queueCount = yield task.getQueueCount();
  const maxNumber = 5;

  if (queueCount > maxNumber) {
    logger.debug(`queue number is large than ${maxNumber}`);
    return;
  }

  const project = new Project();
  const projectData = yield project.getExpectedOne();

  if (!projectData) {
    logger.debug('no project to dispatch');
    return;
  }

  yield createTask(projectData);

  yield project.updateById(projectData._id, {
    time: projectData.duration ? Date.now() + projectData.duration : Number.MAX_SAFE_INTEGER
  });
});
