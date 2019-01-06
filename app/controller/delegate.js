'use strict';

const {
  Controller,
} = require('egg');

class DelegateController extends Controller {

  async message() {
    const ctx = this.ctx;
    const {
      webhook,
      text,
      title,
    } = ctx.request.body;

    await ctx.helper.sendMarkdown({
      webhook,
      title: title || 'title',
      text,
    });

    ctx.success({});
  }

}

module.exports = DelegateController;
