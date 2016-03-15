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

const url = require('url');
const qs = require('querystring');
const bcrypt = require('bcryptjs');
const GithubOauth = require('reliable-github');
const GitlabOauth = require('reliable-gitlab');

const user = require('./api/user');
const _ = require('../../common/utils/helper');
const User = require('../../common/models').User;
const Oauth = require('../../common/models').Oauth;
const config = require('../../common/config').get();
const logger = require('../../common/utils/logger');
const request = require('../../common/utils/request');

const authConfig = config.auth;
const github_client_id = authConfig.github.client_id;
const github_client_secret = authConfig.github.client_secret;
const githubOauth = new GithubOauth({
  client_id: github_client_id,
  client_secret: github_client_secret
});

const gitlab_server_url = authConfig.gitlab.server_url;
const gitlab_protocol = authConfig.gitlab.protocol;
const gitlab_client_id = authConfig.gitlab.client_id;
const gitlab_client_secret = authConfig.gitlab.client_secret;
const gitlabOauth = new GitlabOauth({
  protocol: gitlab_protocol,
  client_id: gitlab_client_id,
  client_secret: gitlab_client_secret,
  server_url: gitlab_server_url
});

function githubHandler() {
  const state = bcrypt.genSaltSync(20);
  this.session.state = state;
  this.session.referer = this.headers.referer;
  const authorizeURL = githubOauth.getAuthorizeURL({
    redirect_uri: `${config.baseurl}/auth/github/callback`,
    state: state
  });
  this.redirect(authorizeURL);
}

function *githubCallbackHandler() {
  if (this.query.state !== this.session.state) {
    this.body = 403;
    return;
  }
  let access_token = null;
  try {
    const access_info = yield githubOauth.getAccessToken({code: this.query.code});
    access_token = access_info.access_token;
  } catch (e) {
    logger.warn(JSON.stringify(e));
    this.body = 404;
    return;
  }

  const options = {
    uri: 'https://api.github.com/user',
    headers: {
      'Authorization': `token ${access_token}`,
      'User-Agent': 'reliale'
    }
  };
  const result = yield request(options);
  let userInfo = JSON.parse(result.body);

  const oauth_user = yield Oauth.findOne({
    oauth_id: userInfo.login,
    oauth_name: 'github'
  });

  if (oauth_user) {
    const user = yield new User().getById(oauth_user.user_id);
    if (user) {
      const session = {
        name: user.nick_name || user.user_name,
        user_name: user.user_name,
        email: user.email
      };
      this.session.user = session;
      var referer = this.session.referer;
      delete this.session.referer;
      var redirect_url = qs.parse(url.parse(referer).query).redirect;
      this.redirect(redirect_url || '/dashboard');
      return;
    }
  }

  if (!oauth_user) {
    yield new Oauth({
      oauth_id: userInfo.login,
      oauth_name: 'github',
      oauth_access_token: access_token
    }).save();
  }

  userInfo = {
    user_name: userInfo.login,
    nick_name: userInfo.name,
    email: userInfo.email,
    oauth_id: userInfo.login
  };

  const context = {
    user: userInfo
  };

  let page = {};
  page.name = 'auth';
  context.csrf = this.csrf;
  context.page = page;
  this.body = this.render('auth', context);
}

function gitlabHandler() {
  this.session.referer = this.headers.referer;
  const authorizeURL = gitlabOauth.getAuthorizeURL({
    redirect_uri: `${config.baseurl}'/auth/gitlab/callback'`
  });
  this.redirect(authorizeURL);
}

function *gitlabCallbackHandler() {
  let access_token = null;
  try {
    const access_info = yield gitlabOauth.getAccessToken({
      code: this.query.code,
      redirect_uri: `${config.baseurl}/auth/gitlab/callback`
    });
    access_token = access_info.access_token;
  } catch (e) {
    logger.warn(JSON.stringify(e));
    this.body = 404;
    return;
  }

  const options = {
    uri: `${gitlab_protocol}://${gitlab_server_url}/api/v3/user`,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'User-Agent': 'reliable'
    }
  };

  const result = yield request(options);
  let userInfo = JSON.parse(result.body);
  const oauth_user = yield Oauth.findOne({
    oauth_id: userInfo.username,
    oauth_name: 'gitlab'
  });

  if (oauth_user) {
    const user = yield new User().getById(oauth_user.user_id);
    if (user) {
      const session = {
        name: user.nick_name || user.user_name,
        user_name: user.user_name,
        email: user.email
      };
      this.session.user = session;
      const referer = this.session.referer;
      delete this.session.referer;
      const redirect_url = qs.parse(url.parse(referer).query).redirect;
      this.redirect(redirect_url || '/dashboard');
      return;
    }
  }

  if (!oauth_user) {
    yield new Oauth({
      oauth_id: userInfo.username,
      oauth_name: 'gitlab',
      oauth_access_token: access_token
    }).save();
  }
  userInfo = {
    user_name: userInfo.username,
    nick_name: userInfo.name,
    email: userInfo.email,
    oauth_id: userInfo.username
  };

  const context = {
    user: userInfo
  };
  let page = {};
  page.name = 'auth';
  context.csrf = this.csrf;
  context.page = page;
  this.body = this.render('auth', context);
}

function *dispatch() {
  switch (this.params.catalog) {
    case 'github':
      if (_.endsWith(this.path, 'callback')) {
        yield githubCallbackHandler.call(this);
        break;
      }
      githubHandler.call(this);
      break;
    case 'gitlab':
      if (_.endsWith(this.path, 'callback')) {
        yield gitlabCallbackHandler.call(this);
        break;
      }
      gitlabHandler.call(this);
      break;
  }
}

module.exports = dispatch;
