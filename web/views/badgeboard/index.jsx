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

var React = require('react');

var Project = require('./project');
var Layout = require('../common/layout');

class Badgeboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout {...this.props}>
        <Project {...this.props}/>
      </Layout>
    );
  }
};

module.exports = Badgeboard;
