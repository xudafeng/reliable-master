'use strict';

const zmq = require('zmq');
const EOL = require('os').EOL;
const cluster = require('cluster');
const events = require('reliable-events');

const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

const STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ACK: 'ack'
};

class Manager {
  constructor() {
    this.slaves = {};
    this.init();
  }

  init() {
    this.monitor();
    _.setArchiveConfig('slaves', this.slaves);
  }

  bind(data) {
    const hostname = data.sysInfo.hostname;

    const sock = zmq.socket('pair');
    const address = `tcp://${data.ip}:${data.port}`;

    logger.debug(`connect to tcp://${data.ip}:${data.port}`);

    sock.connect(address);
    sock.on('message', (e) => {
      const data = JSON.parse(e.toString());
      const _hostname = data.sysInfo.hostname;
      // data
      //
      // {
      //    type: 'ack', 'task', 'monitor'
      //    sysInfo
      //    timestamp
      // }

      switch (data.type) {
        case 'ack':
          this.slaves[hostname || _hostname].status = STATUS.AVAILABLE;
          events.sendToSingleCluster({
            message: events.EVENTS.SLAVE_ONLINE,
            data: this.getAvailableSlaves()
          });
          break;
        case 'task':
          const id = parseInt(Math.random() * Object.keys(cluster.workers).length + 1, 10);
          cluster.workers[id].send({
            message: 'archive',
            data: data
          });
          logger.debug('%s<----- zmq message %s%j', EOL, EOL, data);
          this.slaves[hostname || _hostname].sysInfo = data.sysInfo;
          this.slaves[hostname || _hostname].status = data.status;
          break;
        case 'monitor':
          this.slaves[hostname || _hostname].sysInfo = data.sysInfo;
          this.slaves[hostname || _hostname].timestamp = data.timestamp;
          _.setArchiveConfig('slaves', this.slaves);
          break;
      }
    });
    sock.monitor(500, 0);
    sock.on('disconnect', () => {
      sock.disconnect(address);
      logger.debug('%s is disconnected, original address is %s.', hostname, address);
      delete this.slaves[hostname];
      _.setArchiveConfig('slaves', this.slaves);

      events.sendToSingleCluster({
        message: events.EVENTS.LOST_SLAVE,
        data: this.getAvailableSlaves()
      });
    });
    data.timestamp = Date.now();
    data.sock = sock;
    this.slaves[hostname] = data;
    _.setArchiveConfig('slaves', this.slaves);
  }

  getAvailableSlaves(runiOS) {
    const availableSlaves = _.values(this.slaves).filter(slave => {
      const isAvl = slave.status === STATUS.AVAILABLE;

      if (runiOS) {
        return isAvl && runiOS === slave.supportiOS;
      }

      return isAvl;
    });

    if (!availableSlaves.length) {
      logger.debug('no available slaves to dispatch');
      return;
    }

    return availableSlaves.reduce((previousSlave, currentSlave) => {
      return previousSlave.sysInfo.memory > currentSlave.sysInfo.memory ? previousSlave : currentSlave;
    });
  }

  dispatch(data) {
    if (!this.isReady()) {
      logger.debug('no slave to dispatch');
      return;
    }

    const availableSlave = this.getAvailableSlaves(data.runiOS);

    if (availableSlave) {
      logger.debug('%s----->> dispatch to %s with %s %j', EOL, availableSlave.sysInfo.hostname, EOL, data);
      availableSlave.status = STATUS.BUSY;
      availableSlave.sock.send(JSON.stringify(data));

      Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].send({
          message: 'dispatchSuccess',
          data: data,
          slave: availableSlave
        });
      });
    } else {
      logger.debug('no available slave to dispatch');
    }
  }

  isReady() {
    return Object.keys(this.slaves).length;
  }

  monitor() {
    setInterval(() => {
      if (!this.isReady()) {
        logger.debug('no slave for monitor #1');
        return;
      }
      for (let slave in this.slaves) {
        this.slaves[slave].sock.send(JSON.stringify({
          type: 'monitor',
          timestamp: Date.now()
        }));
      }
    }, 5 * 1000);

    setInterval(() => {
      if (!this.isReady()) {
        logger.debug('no slave for monitor #2');
        return;
      }
      var timestamp = Date.now();

      for (let slave in this.slaves) {
        const diffTime = timestamp - this.slaves[slave].timestamp;
        if (diffTime > 30 * 60 * 1000) {
          delete this.slaves[slave];
          logger.debug('%s is disconnected, due to timeout for 30mins.', slave);
          _.setArchiveConfig('slaves', this.slaves);
        }
      }
    }, 60 * 1000);
  }
}

module.exports = Manager;
