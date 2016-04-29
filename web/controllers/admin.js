

'use strict';

const os = require('os');
const cluster = require('cluster');

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const pagination = require('../../common/utils/pagination');

const User = models.User;
const Task = models.Task;

function *getContext() {
  let context = {};
  let common = {};
  common.page = 'admin';
  common.catalog = this.params.subcatalog;
  common.csrf = this.csrf;
  context.common = common;
  let admin = {};
  context.admin = admin;
  context.session = this.session;
  return context;
}

function *renderUserList() {
  const user = new User();
  const context = yield getContext.call(this);
  const admin = {
    userList: yield user.getAll()
  };
  context.admin = admin;
  this.body = yield this.render.call(this, context);
}

function *renderTaskList() {
  const task = new Task();
  const count = yield task.getTotalCount();
  const context = yield getContext.call(this);
  context.task = {
    list: yield task.getAll(),
    count: count
  };
  const page = this.query.page;
  context.common.pagination = yield pagination(page, Math.ceil(count / OPTIONS.page_size));
  this.body = yield this.render.call(this, context);
}

function *renderSystemInfo() {
  const system = {
    server: yield getServerInfo.call(this),
    system: yield getSystemInfo.call(this),
    configuration: yield getConfigurationInfo.call(this),
    environment: yield getEnvironmentInfo.call(this)
  };
  const context = yield getContext.call(this);
  context.admin = system;
  this.body = yield this.render.call(this, context);
}

function *getSystemInfo() {
  let data = {};
  data.arch = process.arch;
  data.platform = process.platform;
  data.node_version = process.version;

  Object.keys(process.versions).forEach((key) => {
    data[`${key}_version`] = process.versions[key];
  });
  return data;
}

function *getConfigurationInfo() {
  let data = {};
  _.merge(data, OPTIONS);
  return data;
}

function *getEnvironmentInfo() {
  let data = {};
  data.pid = process.pid;
  data.execPath = process.execPath;
  data.debugPort = process.debugPort;
  data.filename = process.mainModule.filename;
  data.paths = process.mainModule.paths;
  _.merge(data, process.env);
  return data;
}

function *getServerInfo() {
  let data = {};
  data.worker = `id:${cluster.worker.id} ${JSON.stringify(os.cpus()[cluster.worker.id - 1].times)}`;
  data.memory = `${os.freemem()} / ${os.totalmem()}`;
  data.uptime = yield uptime();
  data.release = os.release();
  data.tmpdir = os.tmpdir();
  data.hostname = os.hostname();
  return data;
}

function *uptime() {
  const time = os.uptime();
  const days = parseInt(time / 60 / 60 / 24, 10);
  const hours = parseInt((time - days * 60 * 60 * 24) / 60 / 60, 10);
  const minutes = parseInt((time - days * 60 * 60 * 24 - hours * 60 * 60) / 60, 10);
  return `${days}d ${hours}h ${minutes}m`;
}

function *dispatch() {
  switch (this.params.subcatalog) {
    case 'user':
      yield renderUserList.call(this);
      break;
    case 'task':
      yield renderTaskList.call(this);
      break;
    case 'system':
      yield renderSystemInfo.call(this);
      break;
    default:
      this.redirect('admin/project');
      break;
  }
}

module.exports = dispatch;
