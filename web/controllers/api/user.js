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

const User = models.User;
const Subscribe = models.Subscribe;

function *updateUser() {
  const post = yield _.parse(this);
  const id = post.id;

  if (yield User.updateById(id, post.data)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *addUser() {
  const data = yield _.parse(this);
  const user = new User(data);

  try {
    yield user.add();
    this.body = {
      success: true
    };
  } catch(e) {
    var errMsg = '';
    switch (e.code) {
      case 11000:
        errMsg = this.gettext('page.user.user_account_existed');
        break;
      default :
        errMsg = this.gettext('page.global.system_error');
        break;
    }
    this.body = {
      success: false,
      errMsg: errMsg
    };
  }
}

function *deleteUser() {
  const post = yield _.parse(this);
  const id = post.id;

  const removeSubscribe = yield Subscribe.removeByUserId(id);

  if (!removeSubscribe) {
    this.body = {
      success: false
    };
    return;
  }

  if (yield User.removeById(id)) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *subscribe() {
  const post = yield _.parse(this);
  const subscribeId = post.subscribeId;
  const user = yield User.getByUserName(this.session.user.userid);
  const projectId = post.projectId;

  if (subscribeId) {
    const success = yield Subscribe.removeById(subscribeId);

    if (success) {
      this.body = {
        success: true
      };
    } else {
      this.body = {
        success: false
      };
    }
    return;
  }

  const subscribe = new Subscribe({
    userId: user._id,
    projectId: projectId,
    email: user.email
  });

  const success = yield subscribe.add();
  if (success) {
    this.body = {
      success: true
    };
  } else {
    this.body = {
      success: false
    };
  }
}

function *dispatch() {
  switch (this.params.method) {
    case 'add':
      yield addUser.call(this);
      break;
    case 'update':
      yield updateUser.call(this);
      break;
    case 'delete':
      yield deleteUser.call(this);
      break;
    case 'subscribe':
      yield subscribe.call(this);
      break;
  }
}

module.exports = dispatch;
module.exports.addUser = addUser;
