'use strict';

const mongoose = require('mongoose');

const _ = require('../../common/utils/helper');

const Schema = mongoose.Schema;
const P = mongoose.Promise;

// plugin table schema
const PluginSchema = new Schema({

  // plugin name
  name: {
    type: String,
    unique: true
  },

  // plugin link
  url: {
    type: String,
    unique: true
  },

  // plugin data
  data: {
    type: Object,
    default: {}
  }
});

PluginSchema.methods.add = function() {
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

PluginSchema.statics.removeByName = function(name) {
  const promise = new P();

  Plugin.remove({
    name
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

PluginSchema.statics.updateByName = function(name, data) {
  const promise = new P();

  Plugin.update({
    name
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

PluginSchema.statics.getDataByName = function(name) {
  const promise = new P();

  Plugin.findOne({
    name
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

PluginSchema.statics.getAllData = function() {
  const promise = new P();

  Plugin.find({}, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data);
    }
  });
  return promise;
};

PluginSchema.statics.getLinkByName = function(name) {
  const promise = new P();

  Plugin.findOne({
    name
  }, (error, data) => {

    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null, data.link);
    }
  });
  return promise;
};

mongoose.model('Plugin', PluginSchema);

const Plugin = mongoose.model('Plugin');

module.exports = Plugin;
