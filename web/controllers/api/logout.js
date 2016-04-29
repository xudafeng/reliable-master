'use strict';

function *dispatch() {
  this.session = null;
  this.body = {
    success: true,
    data: {}
  };
}

module.exports = dispatch;
