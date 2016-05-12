'use strict';

const user = require('./user');

function *dispatch() {
  yield user.addUser.call(this);
}

module.exports = dispatch;
