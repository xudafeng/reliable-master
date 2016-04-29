'use strict';

const request = require('co-request');

module.exports = function *(options) {
  try {
    return yield request(options);
  } catch (err) {
    console.warn('Get remote update info failed.');

    if (err.code === 'ETIMEDOUT') {
      return null;
    }
  }
};
