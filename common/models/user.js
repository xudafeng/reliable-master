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

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const P = mongoose.Promise;

const SALT_WORK_FACTORY = 10;
const PAGE_SIZE = 10;

const UserSchema = new Schema({

  /**
   * user_name for user
   */

  user_name: {
    type: String,
    unique: true
  },

  /**
   * nick name for user
   */

  nick_name: {
    type: String
  },

  /**
   * user level
   * -1 -> block
   * 0  -> normal
   * 1  -> top user
   * 2  -> adminitrator
   * 3  -> system admin
   */

  user_level: {
    type: Number,
    default: 0
  },

  /**
   * password for user
   */

  password: {
    type: String
  },

  /**
   * email for user
   */

  email: {
    type: String
  },

  /**
   * mobile for user
   */

  mobile: {
    type: String
  },

  /**
   * create time for user
   */

  created_at: {
    type: Date,
    default: Date.now
  },

  /**
   * modify time for user
   */

  updated_at: {
    type: Date,
    default: Date.now
  },

  /**
   * resetPasswordToken for user
   */

  resetPasswordToken: {
    type: String
  },

  /**
   * resetPasswordExpires for user
   */

  resetPasswordExpires: {
    type: Date
  }

});

UserSchema.index({
  _id: 1,
  create_date: -1
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.password) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTORY, (error, salt) => {
    if (error) {
      return next(error);
    } else {
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) {
          return next(error);
        } else {
          user.password = hash;
          next();
        }
      });
    }
  });
});

UserSchema.pre('findOneAndUpdate', function(next) {
  const password = this._update.password;

  if (!password) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTORY, (error, salt) => {
    if (error) {
      return next(error);
    } else {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          return next(error);
        } else {
          this._update.password = hash;
          next();
        }
      });
    }
  });
});

UserSchema.statics = {
  findByEmail: function(email) {
    const promise = new P();
    this.findOne({
      email: email
    }, (error, data) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  updateById: function(id, data) {
    const promise = new P();
    User.findByIdAndUpdate(id, data, {
      upsert: true
    }, (error, data) => {

      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  removeById: function(id) {
    const promise = new P();
    User.remove({
      _id: id
    }, (error, data) => {

      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  getById: function(id) {
    const promise = new P();

    User.findOne({
      _id: id
    }, (error, data) => {

      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  getByUserName: function(userName) {
    const promise = new P();

    User.findOne({
      user_name: userName
    }, (error, data) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  getAllEmails: function() {
    const promise = new P();

    User.find({}, 'email', (error, data) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  },
  getSystemAdminEmails: function() {
    const promise = new P();

    User.find({
      user_level: 3
    }, 'email', (error, data) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  }
};

UserSchema.methods.add = function() {
  const promise = new P();
  this.save((error, data) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

UserSchema.methods.updateByUserName = function(userName, data) {
  const promise = new P();

  User.update({
    user_name: userName
  }, data, {
    upsert: true
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

UserSchema.methods.getAll = function(page) {
  const _page = parseInt(page, 10) || 1;
  const promise = new P();

  User.find({}, null, {
    skip: PAGE_SIZE * (_page - 1),
    sort: {
      _id: -1
    },
    limit: PAGE_SIZE || Infinity
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

UserSchema.methods.getTotalCount = function() {
  const promise = new P();

  User.count({}, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

UserSchema.virtual('created_date').get(function() {
  return _.moment(this.created_at).format('YYYY-MM-DD HH:mm:ss');
});

UserSchema.virtual('updated_date').get(function() {
  return _.moment(this.updated_at).format('YYYY-MM-DD HH:mm:ss');
});

UserSchema.virtual('is_admin').get(function() {
  return this.user_level > 1;
});

UserSchema.virtual('is_sys_admin').get(function() {
  return this.user_level > 2;
});

mongoose.model('User', UserSchema);

const User = mongoose.model('User');
module.exports = User;
