'use strict';

const {
  Service,
} = require('egg');

/* istanbul ignore next */
module.exports = class WebHookService extends Service {

  async pushBuildNotification(data = {}) {
    const ctx = this.ctx;
    // get all webhooks
    const globalConfig = await this.ctx.model.Config.findOne();

    if (!globalConfig || !globalConfig.data || !globalConfig.data.webhooks) {
      return;
    }
    const {
      webhooks,
    } = globalConfig.data;
    try {
      await Promise.all(webhooks
        .filter(webhook => webhook.tag === 'build')
        .map(webhook => ctx.helper.sendDingTalk({
          webhook,
          data,
          staticServerUrl: `http:${this.config.reliableView.staticUrl}`,
          reliableServerUrl: `http:${this.config.reliableView.reliableHost}`,
        })));
    } catch (e) {
      ctx.logger.error(e);
    }
  }
};
