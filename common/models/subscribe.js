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

const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const P = mongoose.Promise;

const SubscribeSchema = new Schema({

  // user id

  userId: {
    type: ObjectId
  },

  // project id

  projectId: {
    type: ObjectId
  },

  // email

  email: {
    type: String
  },

  /**
   * create time for user
   */

  created_at: {
    type: Date,
    default: Date.now
  }

});

SubscribeSchema.index({
  _id: 1,
  create_date: -1
});

SubscribeSchema.statics = {
  findByProjectId: function(projectId) {
    const promise = new P();

    this.find({
      projectId: projectId
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
    Subscribe.remove({
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
  removeByUserId: function(userId) {
    const promise = new P();
    Subscribe.remove({
      userId: userId
    }, (error, data) => {

      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(null, data);
      }
    });
    return promise;
  }
};

SubscribeSchema.methods.add = function() {
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

SubscribeSchema.methods.getByUserId = function(userId) {
  const promise = new P();

  Subscribe.find({
    userId: userId
  }, null, {
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

SubscribeSchema.methods.getByProjectId = function(projectId) {
  const promise = new P();

  Subscribe.find({
    projectId: projectId
  }, null, {
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

SubscribeSchema.virtual('created_date').get(function() {
  return _.moment(this.created_at).format('YYYY-MM-DD HH:mm:ss');
});

mongoose.model('Subscribe', SubscribeSchema);

const Subscribe = mongoose.model('Subscribe');
module.exports = Subscribe;
