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

const auth = require('./middlewares/auth');
const controllers = require('./controllers');
const service = require('./middlewares/service');
const logger = require('../common/utils/logger');

module.exports = function(app) {
  app.get('/', controllers.home);
  app.get('/signup', controllers.signup);
  app.get('/login', controllers.login);
  app.get('/password/retake', controllers.password);
  app.get('/password/reset', controllers.password);
  app.get('/task/:taskId', auth.user, controllers.task);
  app.get('/history/:projectId', auth.user, controllers.history);
  app.get('/history/:projectId/page/:pageNo', auth.user, controllers.history);
  app.get('/dashboard', auth.user, controllers.dashboard);
  app.get('/dashboard/page/:pageNo', auth.user, controllers.dashboard);
  app.get('/dashboard/:catalog', auth.user, controllers.dashboard);
  app.get('/dashboard/:catalog/page/:pageNo', auth.user, controllers.dashboard);
  app.post('/dashboard/:catalog', auth.user, controllers.dashboard);
  app.get('/auth/:catalog', controllers.auth);
  app.get('/auth/:catalog/callback', controllers.auth);
  app.get('/badgeboard', controllers.badgeboard);
  app.get('/badgeboard/:projectId', controllers.badgeboard);
  app.get('/badgeboard/page/:pageNo', controllers.badgeboard);

  // service
  app.all('/api/login', controllers.api.login);
  app.all('/api/logout', controllers.api.logout);
  app.post('/api/signup', controllers.api.signup);
  app.post('/api/auth', controllers.api.auth);
  app.post('/api/password/:method', controllers.api.password);
  app.post('/api/user/:method', auth.user, controllers.api.user);

  app.post('/api/project/:method', auth.user, controllers.api.project);
  app.post('/api/task/:method', auth.user, controllers.api.task);
  app.post('/api/task/:method/gitlab-push.json', service.gitlabCi, controllers.api.task);

  app.get('/api/data', auth.user, controllers.api.data);
  logger.debug('router set');
};
