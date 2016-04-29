

'use strict';

const models = require('../../common/models');
const _ = require('../../common/utils/helper');
const config = require('../../common/config').get();

const User = models.User;

exports.user = function *(next) {

  if (!this.session.user) {
    if (config.site.login) {
      return this.redirect('/');
    } else {
      return this.redirect(`${config.site.loginRedirect}${encodeURIComponent(this.url)}`);
    }
  }
  const userName = this.session.user.userid || this.session.user.user_name;

  const user = new User();

  if (yield User.getByUserName(userName)) {
    yield user.updateByUserName(userName, {
      email: this.session.user.email,
      nick_name: this.session.user.name
    });
    const info = yield User.getByUserName(userName);

    _.merge(this.session.user, {
      is_admin: info.is_admin,
      is_sys_admin: info.is_sys_admin
    });
  } else {
    user.user_name = userName;
    user.nick_name = this.session.user.name;
    user.email = this.session.user.email;
    yield user.add();
  }
  yield next;
};

exports.admin = function *(next) {

  if (!this.session.user) {
    return this.redirect('/');
  } else if (!this.session.user.is_sys_admin) {
    return this.redirect('/');
  }
  yield next;
};
