'use strict';

const querystring = require('querystring');
const debug = require('debug')('reliable:common:dingtalkAuth');

module.exports = class DingtalkAuth {
  constructor({ ctx, appid, appsecret }) {
    this.ctx = ctx;
    this.appid = appid;
    this.appsecret = appsecret;
  }

  async getAuthData({ tmpAuthCode }) {
    const accessTokenInfo = await this._getAccessToken();
    debug(accessTokenInfo);
    const persistentCodeInfo = await this._getPersistentCode({
      accessToken: accessTokenInfo.access_token,
      tmpAuthCode,
    });
    debug(persistentCodeInfo);
    const snsTokenInfo = await this._getSnsToken({
      accessToken: accessTokenInfo.access_token,
      openid: persistentCodeInfo.openid,
      persistentCode: persistentCodeInfo.persistent_code,
    });
    debug(snsTokenInfo);
    const userInfo = await this._getUserInfo({
      snsToken: snsTokenInfo.sns_token,
    });
    debug(userInfo);
    const {
      nick,
      unionid,
      openid,
    } = userInfo.user_info || {};
    return {
      nick,
      unionid,
      openid,
    };
  }

  async _getAccessToken() {
    const query = querystring.stringify({
      appid: this.appid,
      appsecret: this.appsecret,
    });
    debug(query);
    const requestAccessToken = await this.ctx.curl(`https://oapi.dingtalk.com/sns/gettoken?${query}`, {
      dataType: 'json',
    });
    return requestAccessToken.data;
  }

  async _getPersistentCode({ accessToken, tmpAuthCode }) {
    const query = querystring.stringify({
      access_token: accessToken,
    });
    debug(query);
    const requestPersistentCode = await this.ctx.curl(`https://oapi.dingtalk.com/sns/get_persistent_code?${query}`, {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: {
        tmp_auth_code: tmpAuthCode,
      },
    });
    return requestPersistentCode.data;
  }

  async _getSnsToken({ accessToken, openid, persistentCode }) {
    const query = querystring.stringify({
      access_token: accessToken,
    });
    debug(query);
    const requestSnsToken = await this.ctx.curl(`https://oapi.dingtalk.com/sns/get_sns_token?${query}`, {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: {
        openid,
        persistent_code: persistentCode,
      },
    });
    return requestSnsToken.data;
  }

  async _getUserInfo({ snsToken }) {
    const query = querystring.stringify({
      sns_token: snsToken,
    });
    debug(query);
    const requestUserInfo = await this.ctx.curl(`https://oapi.dingtalk.com/sns/getuserinfo?${query}`, {
      dataType: 'json',
      contentType: 'json',
    });
    return requestUserInfo.data;
  }
};
