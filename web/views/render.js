

'use strict';

require('babel/register')({
  extensions: ['.jsx']
});

const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const i18n = require('../resources/i18n');
const logger = require('../../common/utils/logger');

var current = path.join(__dirname, '..', 'views');

logger.debug('render view path: %s', current);

// data
// {
//    page: {
//      name: 'dashboard'
//    },
//    session: {
//
//    }
// }

module.exports = function(options) {
  return function(template, data) {
    const file = path.join(current, template, 'index');
    data._options = options;
    data.gettext = this.gettext;

    let html;

    try {
      const Component = require(file);
      html = '<!DOCTYPE html>';
      html += ReactDOMServer.renderToStaticMarkup(React.createFactory(Component)(data));
    } catch (e) {
      logger.warn(e.stack);
      html = `render template:${template} failed`;
    }

    if (this.body) {
      this.body = html;
    }

    return html;
  };
};

