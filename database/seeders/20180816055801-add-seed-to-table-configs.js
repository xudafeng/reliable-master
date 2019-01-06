'use strict';

const uuidv4 = require('uuid/v4');
const config = require('../../test/fixtures/config-data.json');
const data = JSON.stringify(config);

module.exports = {
  up: async queryInterface => {
    await queryInterface.bulkInsert('configs', [{
      data,
      uniqId: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('configs');
  },
};
