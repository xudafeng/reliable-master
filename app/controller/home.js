'use strict';

const {
  Controller,
} = require('egg');

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    const user = ctx.session.user;
    const { appid, callbackUrl } = ctx.app.config.authorize.dingtalkAuth;
    ctx.body = await this.app.render({
      dingtalkAuth: {
        appid,
        callbackUrl,
      },
      user,
    }, {
      title: 'Reliable Suites for Macaca',
      pageId: 'home',
      SERVER_ADDRESS: this.config.reliableView.serverUrl,
      assetsUrl: this.config.reliableView.assetsUrl,
      version: this.app.config.pkg.version,
    });
  }
}

module.exports = HomeController;
