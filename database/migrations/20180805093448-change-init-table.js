'use strict';

module.exports = {
  up: async queryInterface => {
    await queryInterface.removeColumn('jobNames', 'id');
    await queryInterface.removeColumn('builds', 'id');
    await queryInterface.removeColumn('configs', 'id');

    await queryInterface.renameColumn('jobNames', 'created_at', 'createdAt');
    await queryInterface.renameColumn('jobNames', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('builds', 'created_at', 'createdAt');
    await queryInterface.renameColumn('builds', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('configs', 'created_at', 'createdAt');
    await queryInterface.renameColumn('configs', 'updated_at', 'updatedAt');

    const res = await queryInterface.showConstraint('jobNames');
    for (const item of res) {
      try {
        await queryInterface.removeConstraint('jobNames', item.constraintName);
      } catch (e) { /* */ }
    }
    await queryInterface.addConstraint('jobNames', [ 'uniqId' ], {
      type: 'primary key',
    });
    await queryInterface.addConstraint('jobNames', [ 'jobName' ], {
      type: 'unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    const dataType = {
      type: Sequelize.INTEGER,
    };
    await queryInterface.addColumn('jobNames', 'id', dataType);
    await queryInterface.addColumn('builds', 'id', dataType);
    await queryInterface.addColumn('configs', 'id', dataType);

    await queryInterface.renameColumn('jobNames', 'createdAt', 'created_at');
    await queryInterface.renameColumn('jobNames', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('builds', 'createdAt', 'created_at');
    await queryInterface.renameColumn('builds', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('configs', 'createdAt', 'created_at');
    await queryInterface.renameColumn('configs', 'updatedAt', 'updated_at');

    const res = await queryInterface.showConstraint('jobNames');
    for (const item of res) {
      try {
        await queryInterface.removeConstraint('jobNames', item.constraintName);
      } catch (e) { /**/ }
    }
    await queryInterface.addConstraint('jobNames', [ 'uniqId' ], {
      type: 'primary key',
    });
  },
};
