'use strict';

module.exports = app => {
  const {
    UUID,
    UUIDV4,
    JSON,
  } = app.Sequelize;

  const Config = app.model.define('config', {
    data: JSON,
    uniqId: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
  }, { });

  return Config;
};
