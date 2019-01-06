'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
    JSON,
    ENUM,
    DATE,
  } = app.Sequelize;

  const Build = app.model.define('build', {
    jobName: {
      type: STRING,
    },
    buildNumber: {
      type: STRING,
    },
    gitBranch: {
      type: STRING,
    },
    data: JSON,
    uniqId: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    extendInfo: {
      type: JSON,
      defaultValue: {},
    },
    state: {
      type: ENUM,
      values: [ 'INIT', 'SUCCESS', 'FAIL' ],
    },
    finishedAt: {
      type: DATE,
    },
  }, { });

  return Build;
};
