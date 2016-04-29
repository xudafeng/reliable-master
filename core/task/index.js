
'use strict';

const cluster = require('cluster');

const check = require('./check');
const archive = require('./archive');
const project = require('./project');
const dispatch = require('./dispatch');

exports.run = require('./run');

exports.bind = function() {
  if (cluster.isWorker) {
    cluster.worker.on('message', (e) => {
      switch (e.message) {
        case 'project':
          project();
          break;
        case 'dispatch':
          dispatch();
          break;
        case 'dispatchSuccess':
          dispatch.success(e.data, e.slave);
          break;
        case 'archive':
          archive(e.data);
          break;
        case 'check':
          check(e);
          break;
        case 'slaveReady':
          process._isReady = true;
          break;
      }
    });
  }
};
