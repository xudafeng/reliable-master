'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {
      STRING,
      UUID,
      UUIDV4,
      JSON,
      INTEGER,
      DATE,
    } = Sequelize;

    await queryInterface.createTable('jobNames', {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      jobName: {
        type: STRING,
        primaryKey: true,
      },
      uniqId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      created_at: {
        type: DATE,
        allowNull: false,
      },
      updated_at: {
        type: DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('builds', {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
      created_at: {
        type: DATE,
        allowNull: false,
      },
      updated_at: {
        type: DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('configs', {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      data: JSON,
      uniqId: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      created_at: {
        type: DATE,
        allowNull: false,
      },
      updated_at: {
        type: DATE,
        allowNull: false,
      },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('jobNames');
    await queryInterface.dropTable('builds');
    await queryInterface.dropTable('configs');
  },
};
