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

function fetchProjectsFromREADME(str) {
  const r = /badgeboard\/([0-9a-fA-F]{24})/g;
  const res = [];
  let arr;
  while (arr = r.exec(str)) {
    let s = arr[1];
    if (!~res.indexOf(s)) {
      res.push(s);
    }
  }
  return res;
}

function *gitlabCi(next) {
  const post = yield _.parse(this);
  const data = parseInfo(post);
  const branch = data[0];
  const gitUrl = data[1];
  const archiveCmd = `git archive --remote=${gitUrl} ${branch} README.md | tar -xO`;
  let stdout = '';
  let projects = [];

  try {
    const result = yield _.exec(archiveCmd, {timeout: 5000});
    stdout = result[0];
  } catch(e) {
    logger.debug(`Unable to find README.md in this repo, error:${e}`);
    this.throw(400, 'Unable to find README.md in this repo.');
  }

  projects = fetchProjectsFromREADME(stdout);

  if (!Array.isArray(projects) || !projects.length) {
    logger.debug(`There is no project configured in ${gitUrl}'s README.md.`);
    this.throw(400, `There is no project configured in ${gitUrl}'s README.md.`);
  }

  this.projects = projects;
  yield next;
}

module.exports = {
  gitlabCi
};
