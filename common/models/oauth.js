'use strict';

const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const P = mongoose.Promise;

// project table schema
const OauthSchema = new Schema({

  // user id -> User._id

  user_id: {
    type: String
  },

  // oauth name

  oauth_name: {
    type: String
  },

  // oauth id

  oauth_id: {
    type: String
  }
});

mongoose.model('Oauth', OauthSchema);

const Oauth = mongoose.model('Oauth');

module.exports = Oauth;
