'use strict';

module.exports = app => {
  const {
    STRING,
    UUID,
    UUIDV4,
  } = app.Sequelize;

  const JobName = app.model.define('jobName', {
    jobName: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    uniqId: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
  }, { });

  return JobName;
};
