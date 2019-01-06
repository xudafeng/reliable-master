'use strict';

const {
  Controller,
} = require('egg');

const debug = require('debug')('reliable:controller:snsAuthorize');
const DingtalkAuth = require('../common/snsAuthorize/dingtalkAuth');

class snsAuthorizeController extends Controller {
  async signOut() {
    const ctx = this.ctx;
    debug(ctx.session);
    ctx.session = null;
    ctx.redirect('/');
  }

  async dingtalkCallback() {
    const ctx = this.ctx;
    const { appid, appsecret } = ctx.app.config.authorize.dingtalkAuth;
    this.dingtalkAuth = new DingtalkAuth({
      ctx,
      appid,
      appsecret,
    });
    const { code: tmpAuthCode } = ctx.query;
    const userInfo = await this.dingtalkAuth.getAuthData({ tmpAuthCode });
    debug(userInfo);
    if (!userInfo.openid) {
      ctx.redirect('back');
      return;
    }
    ctx.session.user = userInfo;
    ctx.redirect('back');
  }
}

module.exports = snsAuthorizeController;
