

'use strict';

const EOL = require('os').EOL;
const cluster = require('cluster');

const logger = require('../../common/utils/logger');

function logInline(content) {
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(content.toString());
  }
}

function clearLog() {
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
    process.stdout.write(EOL);
  }
}

class AsynTaskManager {
  constructor(options, callback) {
    this.worker = options.server.worker;
    this.callback = callback;
    this.frame = 5;
    this.pause = false;
    this.start();
  }

  start() {
    let temp;
    let frame = this.frame;

    temp = setInterval(() => {
      if (!frame) {
        clearInterval(temp);
        clearLog();
        this.startAsynTask();
        this.callback();
      } else {
        logInline(`${frame--} seconds after starting...`);
      }
    }, 1000);
  }

  stop() {
    this.pause = true;
  }

  resume() {
    this.pause = false;
  }

  startAsynTask() {
    setInterval(() => {
      this.dispatch({
        message: 'project'
      });
    }, 3 * 1000);

    setInterval(() => {
      this.dispatch({
        message: 'dispatch'
      });
    }, 10 * 1000);

    setInterval(() => {
      this.dispatch({
        message: 'check',
        level: 'global'
      });
    }, 5 * 60 * 1000);
  }

  dispatch(data) {
    if (this.pause) {
      logger.debug('project queue paused');
    } else if (data.level === 'global') {
      const id = parseInt(Math.random() * this.worker + 1, 10);
      cluster.workers[id].send(data);
      logger.debug('check success with data %s %j', EOL, data);
    } else if (process.slaveManager.isReady()) {
      const id = parseInt(Math.random() * this.worker + 1, 10);
      cluster.workers[id].send(data);
      logger.debug('dispatch success with data %s %j', EOL, data);
    } else {
      logger.warn('slaves all offline with data %s %j', EOL, data);
    }
  }
}

module.exports = function(options, callback) {
  new AsynTaskManager(options, callback);
};
