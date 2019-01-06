'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      ENUM,
    } = Sequelize;
    await queryInterface.addColumn('builds', 'state', {
      type: ENUM,
      values: [ 'INIT', 'SUCCESS', 'FAIL' ],
      defaultValue: 'SUCCESS',
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('builds', 'state');
  },
};
