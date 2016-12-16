'use strict';

const co = require('co');
const Mail = require('reliable-mail');
const events = require('reliable-events');

const config = require('../../common/config').get();
const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const mail = new Mail(config);

const User = models.User;
const Task = models.Task;
const Project = models.Project;
const Subscribe = models.Subscribe;

const isUnexpectedTask = taskData => taskData.status === 2;

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

function *createMailData(taskId, Task, Project) {
  const task = new Task();
  const project = new Project();
  const data = yield task.getById(taskId);
  const _data = yield project.getById(data.projectId);
  const subject = `${_data.title}-task info`;

  data.title = _data.title;
  data.subject = subject;
  data.taskId = taskId;

  logger.info('task result is %j', data);
  return data;
}

module.exports = co.wrap(function *(data) {
  try {
    const task = new Task();
    const taskId = data.taskId;

    const taskData = yield task.getById(taskId);

    if (!taskData) {
      logger.warn(`taskId: ${taskId} is not found.`);
      return;
    }

    if (data.status === 'available') {
      yield task.findByIdAndUpdate(taskId, data);

      const userEmailList = yield getUserEmailByTaskId(taskId);

      if (data.status === 3) {
        events.sendToMaster({
          message: events.EVENTS.TASK_FAILED,
          data
        });
      } else {
        events.sendToMaster({
          message: events.EVENTS.TASK_END,
          data
        });
      }

      const mailData = yield createMailData(taskId, Task, Project);

      for (let email of userEmailList) {
        mail.sendTaskEndMail(email, mailData);
      }

    } else if (data.status === 'busy') {
      yield task.findByIdAndPushResult(taskId, data);
    }
  } catch (e) {
    logger.warn(e.stack);
  }
});
