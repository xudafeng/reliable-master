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

function parseInfo(post) {
  logger.debug(`Get post data from GitLab: ${JSON.stringify(post, null, '\t')}`);
  try {
    const gitUrl = post.repository.url;
    const type = post.object_kind;
    let branch;
    if (type === 'push') {
      branch = post.ref.split('/').pop();
    } else if (type === 'merge_request') {
      branch = post.object_attributes.target_branch;
    } else {
      logger.debug(`Not supported gitlab service: ${type}`);
    }
    return [branch, gitUrl];
  } catch (err) {
    logger.debug(`Error happened when parsing GitLab post data: ${err}`);
    throw new Error('No data is available in JSON!');
  }
}

function *gitlabCi(next) {
  let ymlObject = null;
  const post = yield _.parse(this);
  const data = parseInfo(post);
  const branch = data[0];
  const gitUrl = data[1];
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
