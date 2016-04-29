'use strict';

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');
const pagination = require('../../common/utils/pagination');

const Task = models.Task;
const Project = models.Project;

function *getContext() {
  const projectId = this.params.projectId;
  const project = new Project();
  const projectData = yield project.getById(projectId);
  const task = new Task();
  const pageNo = this.params.pageNo || 1;
  const data = yield task.getByProjectId(projectId, pageNo);
  const count = yield task.getTaskCountByProjectId(projectId);
  const page_size = 10;

  let context = {};
  context.history = {
    list: data,
    count: count,
    project: projectData
  };

  context.session = this.session;
  let page = {};
  page.name = 'history';
  context.csrf = this.csrf;
  page.subtitle = projectData.title;
  page.pagination = yield pagination(pageNo, Math.ceil(count / page_size));
  context.page = page;
  return context;
}

function *dispatch() {
  logger.debug('controller history');
  const context = yield getContext.call(this);
  this.body = this.render('history', context);
}

module.exports = dispatch;
