

'use strict';

const redis = require('redis');

const host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
const port = process.env.REDIS_PORT_6379_TCP_PORT || 6379;

const client = redis.createClient(port, host);

module.exports = client;
