/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Nov 22 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const redis = require('redis');

const host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
const port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;

const client = redis.createClient(port, host);

module.exports = client;
