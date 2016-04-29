

'use strict';

const url = require('url');
const qs = require('querystring');

const _ = require('../../../common/utils/helper');
const User = require('../../../common/models').User;
const Oauth = require('../../../common/models').Oauth;

function *dispatch() {
  const data = yield _.parse(this);
  const new_user = new User(data);
  console.log(data);
  try {
    yield new_user.add();
    yield Oauth.findOneAndUpdate({
      oauth_id: data.oauth_id
    }, {
      user_id: new_user._id
    }, {
      upsert: true
    });

    const session = {
      name: new_user.nick_name || new_user.user_name,
      user_name: new_user.user_name,
      email: new_user.email
    };
    this.session.user = session;
    const referer = this.session.referer;
    delete this.session.referer;
    let redirect_url = '';

    if (redirect_url) {
      try {
        redirect_url = qs.parse(url.parse(referer).query).redirect;
      } catch (e) {
        logger.warn(e.message);
      }
    }
    this.body = {
      success: true,
      redirect: redirect_url
    };
  } catch (e) {
    let errMsg = '';
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

module.exports = dispatch;
