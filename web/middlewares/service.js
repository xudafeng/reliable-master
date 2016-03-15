/* ================================================================
 * reliable-master
 *
 * first created at : Mon Jan 25 2016 21:00:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const YAML = require('yamljs');

const _ = require('../../common/utils/helper');
const logger = require('../../common/utils/logger');

function *gitlabCi(next) {
  let ymlObject = null;
  const post = yield _.parse(this);
  const branch = post.ref.split('/').pop();
  const gitUrl = post.repository.url;
  const archiveCmd = `git archive --remote=${gitUrl} ${branch} .macaca.yml | tar -xO`;

  try {
    const result = yield _.exec(archiveCmd, {timeout: 5000});
    const stdout = result[0];
    ymlObject = YAML.parse(stdout);
  } catch(e) {
    logger.debug(`Unable to parse macaca yml file, error:${e}`);
    this.throw(400, 'Unable to parse macaca yml file');
  }

  if (!ymlObject) {
    logger.debug(`Repository ${gitUrl} does not hava a .macaca.yml file.`);
    this.throw(400, `Repository ${gitUrl} does not hava a .macaca.yml file.`);
  }

  const projects = ymlObject.projects;

  if (!projects || !Array.isArray(projects) || !projects.length) {
    logger.debug(`There is no project configured in ${gitUrl}'s .macaca.yml.`);
    this.throw(400, `There is no project configured in ${gitUrl}'s .macaca.yml.`);
  }

  this.projects = projects;
  yield next;
}

module.exports = {
  gitlabCi
};
