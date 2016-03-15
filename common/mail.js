/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2013 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

require('babel/register')({
  extensions: ['.jsx']
});

const path = require('path');
const EOL = require('os').EOL;
const React = require('react');
const nodemailer = require('nodemailer');

const models = require('./models');
const _ = require('./utils/helper');
const config = require('./config').get();
const logger = require('./utils/logger');
const gettext = require('../web/resources/i18n')(config.site.locale);

const Task = models.Task;
const Project = models.Project;
const transporter = nodemailer.createTransport(config.mail);

const render = function(type, data) {
  const file = path.join(__dirname, 'mail-tpl');
  let html;

  try {
    const Component = require(file)[type];
    html = React.renderToStaticMarkup(React.createElement(Component, data));
  } catch (e) {
    logger.warn(e.stack);
  }
  return html;
};

const sendMail = exports.sendMail = function(data) {
  logger.debug('email send with data:%s%j', EOL, data);

  transporter.sendMail({
    from: config.mail.auth.user,
    to: data.to,
    subject: data.subject,
    html: data.text
  }, err => {
    logger.warn(`${err}`);
  });
};

exports.sendAccountActiveMail = function(to) {
  let context = {};
  context.name = config.mail.name;
  context.link = config.site.baseurl;

  const subject = `${context.name}${gettext('email.register.new')}`;

  sendMail({
    to,
    subject,
    text
  });
};

/**
 * Reset password email
 * @param {String} to
 * @param {String} token
 */

exports.sendResetPasswordMail = function(to, token) {
  let context = {};
  context.name = config.mail.name;
  context.link = `${config.site.baseurl}/password/reset?token=${token}`;

  const subject = `${context.name}${gettext('page.global.resetPassword')}`;

  sendMail({
    to,
    subject,
    text: render('ResetPasswordMail', context)
  });
};

/**
 * Task complete email
 * @param {String} to
 * @param {String} taskId
 */

exports.sendTaskEndMail = function *(to, taskId) {
  const task = new Task();
  const project = new Project();
  let data = yield task.getById(taskId);
  const _data = yield project.getById(data.projectId);
  console.log(gettext('email.task.taskInfo'));
  const subject = `${_data.title}-${gettext('email.task.taskInfo')}`;

  data.title = _data.title;

  let context = {};
  context.task = data;
  context.taskUrl = `${config.site.baseurl}/task/${taskId}`;

  sendMail({
    to,
    subject,
    text: render('TaskEndMail', context)
  });
};

exports.sendNoticeMail = function(to, subject, content) {
  const context = {
    subject,
    content,
    date: _.moment().format('YYYY-MM-DD'),
    link: config.site.baseurl,
    name: config.mail.name
  };
  sendMail({
    to,
    subject,
    text: render('SiteNotice', context)
  });
};
