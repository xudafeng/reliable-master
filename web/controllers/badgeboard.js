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

const React = require('react');
const Badgeboard = require('badgeboard');

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const config = require('../../common/config').get();
const logger = require('../../common/utils/logger');
const pagination = require('../../common/utils/pagination');

const Task = models.Task;
const Project = models.Project;
const TASK_STATUS = Task.STATUS;

function getPassingRate(data) {
  if (data.status === 0 || data.status === 1) {
    return '0%';
  }

  try {
    const extra = JSON.parse(data.extra);
    let value = parseInt(extra.passing / (extra.passing + extra.failing) * 100, 10);

    if (isNaN(value)) {
      value = 0;
    }
    return `${value}%`;
  } catch (e) {
    logger.warn(e.stack);
  }
  return '0%';
}

function *dataAdapter(projectId) {

  const colorMap = ['#f0ad4e', '#5bc0de', '#5cb85c', '#d9534f'];

  const task = new Task();
  const data = yield task.getLastOneByProjectId(projectId);

  try {
    const status = data.status;

    return {
      left_text: TASK_STATUS[status],
      right_bg_color: colorMap[status],
      right_text: getPassingRate(data)
    };
  } catch (e) {
    logger.warn(e.stack);
  }

  return {
    left_text: 'none',
    right_text: '0%'
  };
}

function *getAllProjects(page) {
  var project = new Project();

  return {
    list: yield project.getAll(page),
    count: yield project.getTotalCount()
  };
}

function *getContext() {
  var context = {};
  context.session = this.session;
  context.pathname = this.url;
  context.csrf = this.csrf;
  var page_size = 10;
  var pageNo = this.params.pageNo || 1;
  var page = {};
  page.name = 'badgeboard';
  var project = yield getAllProjects.call(this, pageNo);
  context.project = project;
  page.csrf = this.csrf;
  page.pagination = yield pagination(pageNo, Math.ceil(project.count / page_size));
  context.page = page;
  return context;
}

function *badgeboard() {
  const projectId = this.params.projectId;

  if (projectId) {

    var data = _.merge(Badgeboard.DEFAULT_DATA, yield dataAdapter(projectId));
    var _data = _.clone(data);

    var title = this.query.title;

    if (title) {
      _data.left_text = title;
    }

    const body = Badgeboard(_data);
    this.body = body;

    if (this.query.editor) {
      this.body = Badgeboard(data);
      this.body += '<p>html:</p><textarea style="width:100%;height:60px">';
      this.body += `<a href="${config.site.baseurl}/history/${projectId}"`;
      this.body += ` target="_blank"><img src="${config.site.baseurl}/badgeboard/${projectId}"/></a></textarea>`;
      this.body += '<p>markdown:</p><textarea style="width:100%;height:60px">';
      this.body += '[![reliable ci][reliable-image]][reliable-url]\n[reliable-image]: ';
      this.body += `${config.site.baseurl}/badgeboard/${projectId}\n[reliable-url]: `;
      this.body += `${config.site.baseurl}/history/${projectId}</textarea>`;


      if (!title) {
        return;
      }

      this.body += '<br /><br /><p>custom style:</p>';
      const body = Badgeboard(_data);

      this.body += body;

      this.body += '<p>html:</p><textarea style="width:100%;height:60px">';
      this.body += `<a href="${config.site.baseurl}/history/${projectId}"`;
      this.body += ` target="_blank"><img src="${config.site.baseurl}/badgeboard/${projectId}?title=${title}"/></a></textarea>`;
      this.body += '<p>markdown:</p><textarea style="width:100%;height:60px">';
      this.body += '[![reliable ci][reliable-image]][reliable-url]\n[reliable-image]: ';
      this.body += `${config.site.baseurl}/badgeboard/${projectId}?title=${title}\n[reliable-url]: `;
      this.body += `${config.site.baseurl}/history/${projectId}</textarea>`;

    } else {
      this.type = 'image/svg+xml;charset=utf-8';
    }
  } else {
    this.body = this.render('badgeboard', yield getContext.call(this));
  }
}

module.exports = badgeboard;
