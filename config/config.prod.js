'use strict';

const dbConfig = require('../database/config');
exports.sequelize = dbConfig.production;
