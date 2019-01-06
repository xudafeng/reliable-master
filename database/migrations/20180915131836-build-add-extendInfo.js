'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      JSON,
    } = Sequelize;
    await queryInterface.addColumn('builds', 'extendInfo', {
      type: JSON,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('builds', 'extendInfo');
  },
};
