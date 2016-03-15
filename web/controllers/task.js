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

const models = require('../../common/models');
const logger = require('../../common/utils/logger');

const Task = models.Task;
const Project = models.Project;

function *getContext() {
  const taskId = this.params.taskId;
  const task = new Task();
  const data = yield task.getById(taskId);
  const project = new Project();
  const _data = yield project.getById(data.projectId);
  data.title = _data.title;
  let context = {};
  context.detail = data;

  context.session = this.session;
  let page = {};
  page.name = 'task';
  page.subtitle = _data.title;
  context.csrf = this.csrf;
  context.page = page;
  return context;
}

function *render() {
  const context = yield getContext.call(this);
  this.body = this.render('task', context);
}

function *dispatch() {
  logger.debug('controller detail');
  yield render.call(this);
}

module.exports = dispatch;
