

'use strict';

const path = require('path');
const favicon = require('koa-favicon');

const dir = path.join(__dirname, '..', 'public', 'images', 'favicon.ico');

module.exports = function() {
  return favicon(dir);
};
