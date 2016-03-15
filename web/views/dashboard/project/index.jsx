/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const React = require('react');

const Charts = require('../charts');
const Content = require('./content');
const Pagination = require('../../common/pagination');

class Project extends React.Component {
  render() {
    return (
      <div className="container content-wrapper">
        <Charts {...this.props} />
        <Content {...this.props} />
        <Pagination {...this.props}/>
      </div>
    );
  };
}

module.exports = Project;
