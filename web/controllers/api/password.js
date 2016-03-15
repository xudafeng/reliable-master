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

const bcrypt = require('bcryptjs');

const models = require('../../../common/models');
const _ = require('../../../common/utils/helper');
const sendResetPasswordMail = require('../../../common/mail').sendResetPasswordMail;

const User = models.User;

function *retake() {
  const data = yield _.parse(this);
  try {
    const user = yield User.findByEmail(data.email);
    if (user) {
      const token = bcrypt.genSaltSync();
      yield User.updateById(user._id, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });
      sendResetPasswordMail(user.email, token);
      this.body = {
        success: true
      };
      return;
    }
    this.body = {
      success: false,
      errMsg: this.gettext('page.password.wrong_email')
    };
  } catch (e) {
    this.body = {
      success: false,
      errMsg: this.gettext('page.global.system_error')
    };
  }
}

function *reset() {
  const data = yield _.parse(this);
  try {
    const user = yield User.findOne({
      resetPasswordToken: this.query.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    });

    if (!user) {
      this.body = {
        success: false,
        errMsg: this.gettext('page.password.wrong_token')
      };
      return;
    }
    yield User.updateById(user._id, {
      password: data.password,
      resetPasswordToken: '',
      resetPasswordExpires: ''
    });
    this.body = {
      success: true
    };
  } catch (e) {
    this.body = {
      success: false,
      errMsg: this.gettext('page.global.system_error')
    };
  }
}

function *dispatch() {
  if (this.params.method === 'retake') {
    yield retake.call(this);
  } else if (this.params.method === 'reset') {
    yield reset.call(this);
  }
}

module.exports = dispatch;
