/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

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
