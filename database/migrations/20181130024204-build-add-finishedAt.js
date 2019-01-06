'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      DATE,
    } = Sequelize;
    await queryInterface.addColumn('builds', 'finishedAt', {
      type: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('builds', 'finishedAt');
  },
};
