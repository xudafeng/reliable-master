'use strict';

const killing = require('killing');

module.exports = function(signal) {
  switch (signal) {
    case 'stop':
      killing('reliable-master');
      break;
    case 'restart':
      // TODO
      break;
    default:
      console.log('\n  arguments `\u001b[33m%s\u001b[0m` not found', signal || 'undefined');
      break;
  }
};
