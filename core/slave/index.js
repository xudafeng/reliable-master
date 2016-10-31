'use strict';

const co = require('co');
const cluster = require('cluster');

const Manager = require('./manager');
const _ = require('../../common/utils/helper');

exports.middleware = function *(next) {
  if (this.url === '/' && this.method === 'POST') {
    if (process._isReady) {
      const post = yield _.parse(this);

      process.send({
        message: 'bindSlave',
        data: post
      });
      this.body = {
        status: 'ack'
      };
    }
  } else if (this.url === '/slaves' && this.method === 'GET') {
    this.body = yield _.getArchiveConfig('slaves');
  } else {
    yield next;
  }
};

exports.init = function() {
  if (cluster.isMaster) {
    process.slaveManager = process.slaveManager || new Manager();

    Object.keys(cluster.workers).forEach(id => {
      cluster.workers[id].on('message', e => {
        switch (e.message) {
          case 'bindSlave':
            const data = e.data;
            if (data.supportiOS !== undefined) {
              data.supportiOS = data.supportiOS === 'true';
            }

            process.slaveManager.bind(data);
            break;
          case 'dispatchTask':
            process.slaveManager.dispatch(e.data);
            break;
        }
      });
      cluster.workers[id].send({
        message: 'slaveReady'
      });
    });
  }
};
