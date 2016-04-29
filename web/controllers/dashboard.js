

'use strict';

const React = require('react');
const hostname = require('os').hostname();

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');
const pagination = require('../../common/utils/pagination');
const sendNoticeMail = require('../../common/mail').sendNoticeMail;

const User = models.User;
const Project = models.Project;
const Subscribe = models.Subscribe;

function *getAllProjects(page) {
  const project = new Project();

  return {
    list: yield project.getAll(page),
    count: yield project.getTotalCount()
  };
}

function *getAllUsers(page) {
  const user = new User();

  return {
    list: yield user.getAll(page),
    count: yield user.getTotalCount()
  };
}

function *getUserSubscribe() {
  const subscribe = new Subscribe();
  const user_name = this.session.user.userid || this.session.user.user_name;
  const user = yield User.getByUserName(user_name);
  return yield subscribe.getByUserId(user._id);
}

function *getDefaultContext() {
  let context = {};
  context.session = this.session;
  context.csrf = this.csrf;
  context.pathname = this.url;
  context.masterName = hostname;
  var slaves = yield _.getArchiveConfig('slaves');
  context.slaves = Object.keys(slaves || {}).length;
  const page_size = 10;
  const pageNo = this.params.pageNo || 1;
  let page = {};
  page.catelog = 'default';
  page.name = 'dashboard';
  const subscribe = yield getUserSubscribe.call(this);
  context.subscribe = subscribe;
  const project = yield getAllProjects.call(this, pageNo);
  context.project = project;
  page.csrf = this.csrf;
  page.pagination = yield pagination(pageNo, Math.ceil(project.count / page_size));
  context.page = page;
  return context;
}

function *getUserContext() {
  let context = {};
  context.session = this.session;
  context.masterName = hostname;
  context.pathname = this.url;
  var slaves = yield _.getArchiveConfig('slaves');
  context.slaves = Object.keys(slaves || {}).length;
  let page = {};
  page.catelog = 'user';
  page.name = 'dashboard';
  page.csrf = this.csrf;
  context.page = page;
  return context;
}

function *getSettingContext() {
  let context = {};
  context.session = this.session;
  context.pathname = this.url;
  context.masterName = hostname;
  var slaves = yield _.getArchiveConfig('slaves');
  context.slaves = Object.keys(slaves || {}).length;
  context.csrf = this.csrf;
  let page = {};
  const page_size = 10;
  const pageNo = this.params.pageNo || 1;
  const user = yield getAllUsers.call(this, pageNo);
  page.pagination = yield pagination(pageNo, Math.ceil(user.count / page_size));
  page.catelog = 'setting';
  page.name = 'dashboard';
  page.csrf = this.csrf;
  context.user = user;
  context.page = page;
  return context;
}

function *getSendMailContext() {
  let context = {};
  context.session = this.session;
  context.pathname = this.url;
  context.masterName = hostname;
  var slaves = yield _.getArchiveConfig('slaves');
  context.slaves = Object.keys(slaves || {}).length;
  context.csrf = this.csrf;
  let page = {};
  page.catelog = 'mail';
  page.name = 'dashboard';
  page.csrf = this.csrf;
  context.page = page;
  return context;
}

function *postSendMail() {
  const data = yield User.getAllEmails();
  const emails = data.map(obj => obj.email);
  const post = yield _.parse(this);
  const title = post.title;
  const content = post.content.replace(/\r?\n/g, '<br />');
  emails.forEach(email => {
    try {
      sendNoticeMail(email, title, content);
    } catch(e) {
      logger.warn(`Send email error happens, to: ${email}, title: ${title}, content: $(content).`);
    }
  });
  return 'Mail Sent Success!';
}

function *dispatch() {
  switch (this.params.catalog) {
    case 'user':
      this.body = this.render('dashboard', yield getUserContext.call(this));
      break;
    case 'setting':
      if (!this.session.user.is_sys_admin) {
        this.redirect('/');
      } else {
        this.body = this.render('dashboard', yield getSettingContext.call(this));
      }
      break;
    case 'mail':
      if (!this.session.user.is_sys_admin) {
        this.redirect('/');
      } else {
        if (this.method === 'GET') {
          this.body = this.render('dashboard', yield getSendMailContext.call(this));
        } else if (this.method === 'POST') {
          this.body = yield postSendMail.call(this);
        }
      }
      break;
    default:
      this.body = this.render('dashboard', yield getDefaultContext.call(this));
      break;
  }
}

module.exports = dispatch;
