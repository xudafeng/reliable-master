

'use strict';

const User = require('../../common/models/').User;

exports.addUser = function(userInfo, callback) {
  const user = new User(userInfo);

  user.save((err, user) => {
    if (err) {
      console.log('something wrong');
      return;
    }
    callback(true);
  });
};

exports.checkEmail = function(email, callback) {
  if (User.findByEmail(email)) {
    return false;
  } else {
    return true;
  }
};
