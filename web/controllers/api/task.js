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

const models = require('../../../common/models');
const _ = require('../../../common/utils/helper');
const logger = require('../../../common/utils/logger');
const pagination = require('../../../common/utils/pagination');

const Task = models.Task;
const Project = models.Project;

function *getAllTasks(page) {
  const task = new Task();

  return {
    list: yield task.getAll(page),
    count: yield task.getTotalCount()
  };
}

function *getContext() {
  let context = {};
  context.session = this.session;
  const page = this.query.page;
  const task = yield getAllTasks.call(this, page);
  context.task = task;
  const _page_ = {};
  _page_.name = 'task';
  _page_.csrf = this.csrf;
  _page_.pagination = yield pagination(_page_, Math.ceil(task.count / OPTIONS.page_size));
  context.page = _page_;
  return context;
}

function *addTask() {
  const post = yield _.parse(this);
  const task = new Task();
  _.merge(task, post);
  task.repository = _.trim(task.repository);
  task.create_user_nick_name = this.session.user.name;
  task.last_modify_nick_name = this.session.user.name;
  task.create_user_id = this.session.user.userid;
  task.last_modify_user_id = this.session.user.userid;
  task.time = _.moment().format('x');

  if (yield task.add()) {
    this.body = {
      success: true,
      errorMsg: null,
      data: null
    };
  } else {
    this.body = {
      success: false,
      errorMsg: this.gettext('page.global.system_error'),
      data: null
    };
  }
}

function *updateTask() {
  const post = yield _.parse(this);
  const taskId = post.taskId;
  const task = new Task();
  const data = yield task.getById(taskId);

  if (data.status === 1) {
    this.body = {
      success: false,
      errMsg: 'task is running!'
    };
    return;
  }

  _.merge(data, post.data);
  _.merge(data, {
    result: '',
    extra: '',
    slaveId: '',
    start_at: null,
    end_at: null
  });

  if (yield task.updateById(taskId, data)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *closeTask() {
}

function *getTask() {
  const post = yield _.parse(this);
  const id = post.id;
  const task = new Task();
  const data = yield task.getById(id);

  this.body = {
    success: true,
    data: data
  };
}

function *deleteTask() {
  var post = yield _.parse(this);
  var id = post.id;
  var task = new Task();

  if (task.removeById(id)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *cleanTasks() {
  var post = yield _.parse(this);
  var id = post.id;
  var task = new Task();

  if (task.cleanTasksByProjectId(id)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *createTask() {
  logger.debug(`Creating tasks...`);
  const projects = this.projects;
  const inValidProjectsId = [];

  // check invalid project id(s)
  const inValidProjectIds = projects.filter(function(project) {
    // check id if it was a valid ObjectId in mongodb
    return !project.toString().match(/^[0-9a-fA-F]{24}$/);
  });

  if (inValidProjectIds.length) {
    logger.debug(`Project id(s) does not exist in database: ${inValidProjectIds}`);
    this.throw(400, `Project id(s) does not exist in database: ${inValidProjectIds}`);
  }

  const notExistProjectIds = [];

  const checkProjectIds = projects.map(function(projectId) {
    return Project.findOne({
      _id: projectId
    });
  });

  const projectsData = yield checkProjectIds;

  projectsData.forEach((val, index) => {
    if (!val) {
      notExistProjectIds.push(checkProjectIds[index]);
    }
  });

  if (notExistProjectIds.length) {
    logger.debug(`Project id(s) does not exist in database: ${notExistProjectIds}`);
    this.throw(400, `Project id(s) does not exist in database: ${notExistProjectIds}`);
  }

  const tasks = projects.map(function(projectId) {
    let task = new Task();
    task.projectId = projectId;
    return task.add();
  });

  try {
    yield tasks;
    logger.debug(`Create tasks success, projectId: ${projects}`);
    this.body = 'ok';
  } catch (err) {
    logger.debug(`Create task failed, ${err}`);
    this.throw(500, 'Create task failed!');
  }
}

function *dispatch() {
  switch (this.params.method) {
    case 'add':
      yield addTask.call(this);
      break;
    case 'create':
      yield createTask.call(this);
      break;
    case 'close':
      yield closeTask.call(this);
      break;
    case 'delete':
      yield deleteTask.call(this);
      break;
    case 'update':
      yield updateTask.call(this);
      break;
    case 'clean':
      yield cleanTasks.call(this);
      break;
    case 'get':
      yield getTask.call(this);
      break;
  }
}

module.exports = dispatch;
