

'use strict';

const bcrypt = require('bcryptjs');

const models = require('../../../common/models');
const _ = require('../../../common/utils/helper');
const logger = require('../../../common/utils/logger');

const User = models.User;

function *dispatch() {
  const post = yield _.parse(this);
  const data = yield User.getByUserName(post.user_name);

  if (data) {
    const same = bcrypt.compareSync(post.password, data.password);
    if (!same) {
      this.body = {
        success: false,
        errMsg: this.gettext('page.login.wrong_password'),
        data: {
        }
      };
      return;
    }

    let session = {};
    session.is_admin = data.is_admin;
    session.name = data.nick_name || data.user_name;
    session.user_name = data.user_name;
    session.email = data.email;
    this.session.user = session;

    logger.debug(`user ${post.user_name} session set`);
    this.body = {
      success: true,
      errMsg: null,
      data: {
      }
    };
  } else {
    this.body = {
      success: false,
      errMsg: this.gettext('page.login.user_not_exist'),
      data: {
      }
    };
  }
}

module.exports = dispatch;
