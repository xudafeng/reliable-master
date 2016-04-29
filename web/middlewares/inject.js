

'use strict';

const render = require('../views/render');

module.exports = function(app) {
  return function *inject(next) {
    this.render = render.call(this, app._options);
    yield next;
  };
};
