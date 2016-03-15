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

const mailer = require('../../common/mail');
const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const User = models.User;
const Task = models.Task;
const Project = models.Project;
const Subscribe = models.Subscribe;

function isUnexpectedTask(taskData) {
  try {
    var result = JSON.parse(taskData.extra);
    return !result.passing;
  } catch (e) {
    logger.debug(`JSON parse task ${taskData.projectId} data error!`);
    return false;
  }
}

/**
 *
 * @param {Object} taskData
 * @returns {Array}
 */
function *getUserEmailByTaskId(taskId) {
  const project = new Project();
  const task = new Task();
  let taskData = yield task.getById(taskId);
  const projectData = yield project.getById(taskData.projectId);
  let mailQueue = [];

  if (!projectData) {
    logger.warn(`projectId: ${taskData.projectId} is not found.`);
    return mailQueue;
  }

  if (isUnexpectedTask(taskData)) {
    let systemAdminEmails = yield User.getSystemAdminEmails();
    let result = taskData.result;
    let errorMsg = ['An unexpected error has occurred, only for super admin to review.'];
    taskData.result = errorMsg.concat(result);
    yield taskData.save();
    return systemAdminEmails;
  }

  let subscribes = yield Subscribe.findByProjectId(projectData._id);

  subscribes.forEach((subscribe) => {
    mailQueue.push(subscribe.email);
  });
  /*
  let last_modify_email = projectData.last_modify_email;

  if (!~mailQueue.indexOf(last_modify_email)) {
    mailQueue.push(last_modify_email);
  }
  */
  return mailQueue;
};

module.exports = co.wrap(function *(data) {
  const task = new Task();
  const taskId = data.taskId;

  const taskData = yield task.getById(taskId);

  if (!taskData) {
    logger.warn(`taskId: ${taskId} is not found.`);
    return;
  }

  if (data.status === 'available') {
    yield task.findByIdAndUpdate(taskId, data);

    try {
      const userEmailList = yield getUserEmailByTaskId(taskId);

      let queue = [];
      userEmailList.forEach((email) => {
        queue.push(mailer.sendTaskEndMail(email, taskId));
      });
      yield queue;
    } catch (e) {
      logger.warn(e.stack);
    }
  } else if (data.status === 'busy') {
    yield task.findByIdAndPushResult(taskId, data);
  }
});
