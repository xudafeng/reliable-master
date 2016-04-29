

'use strict';

const i18n = require('../resources/i18n');
const _ = require('../../common/utils/helper');

const locales = ['zh_CN', 'en_US'];

module.exports = function(app) {
  return function *inject(next) {
    const locale = this.query.locale || this.cookies.get('locale') || app._options.site.locale;
    if (locale) {
      if (_.includes(locales, locale)) {
        app.options['locale'] = locale;
        this.gettext = i18n(locale);
        this.cookies.set('locale', locale);
      }
    }
    yield next;
  };
};

