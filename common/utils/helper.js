

'use strict';

const fs = require('fs');
const _ = require('xutil');
const path = require('path');
const parse = require('co-body');
const validator = require('validator');
const exec = require('child_process').exec;

const redis_client = require('../../core/redis');
const logger = require('../../common/utils/logger');

const REDIS_KEY_SLAVES = 'slaves';

_.camelcase = (str) => {
  return str.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
};

_.getConfig = (program) => {
  let cfg = {};

  program.options.forEach(item => {
    const key = _.camelcase(item.name());

    if (key in program) {

      if (typeof program[key] !== 'function') {
        cfg[key] = program[key];
      }
    }
  });
  return cfg;
};

_.setArchiveConfig = (key, content) => {
  redis_client.set(REDIS_KEY_SLAVES, JSON.stringify(content));
};

_.getArchiveConfig = (key) => {
  return new Promise((resolve, reject) => {
    redis_client.get(REDIS_KEY_SLAVES, (err, obj) => {
      if (err) {
        return reject(err);
      }
      try {
        const result = JSON.parse(obj);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  });
};

_.secondsToTime = (secs) => {
  const hours = Math.floor(secs / (60 * 60));

  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);

  const obj = {
    h: hours,
    m: minutes,
    s: seconds
  };
  return obj;
};

_.exec = (cmd, options) => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve([stdout, stderr]);
    });
  });
};

_.parse = parse;
_.validator = validator;

module.exports = _;
