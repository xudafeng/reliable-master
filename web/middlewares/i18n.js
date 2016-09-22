'use strict';

const i18n = require('../resources/i18n');
const _ = require('../../common/utils/helper');

const locales = ['zh-CN', 'en-US'];

module.exports = function(app) {
  return function *inject(next) {
    let locale = this.query.locale || this.cookies.get('locale') || this.request.acceptsLanguages();

    if (typeof locale === 'string') {
      locale = [locale];
    }

    locale = _.intersection(locale, locales)[0] || app._options.site.locale;
    app._options.locale = locale;
    const i = i18n(locale);
    app.addPluginText = i.addPluginText;
    this.gettext = i.gettext;
    this.cookies.set('locale', locale);

    yield next;
  };
};

