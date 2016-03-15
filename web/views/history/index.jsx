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

const Charts = require('./charts');
const Content = require('./content');
const Layout = require('../common/layout');
const Pagination = require('../common/pagination');

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout {...this.props}>
        <div className="container content-wrapper">
          <ol className="breadcrumb">
            <li><a href="/dashboard">{this.props.gettext('page.common.nav.tasklist')}</a></li>
            <li className="active">{this.props.history.project.title}</li>
            <a href={`/badgeboard/${this.props.history.project.id}?editor=true`} target="_blank">
              <img className="pull-right" src={`/badgeboard/${this.props.history.project.id}`} />
            </a>
          </ol>
          <Charts {...this.props} />
          <Content {...this.props} />
          <Pagination {...this.props}/>
        </div>
      </Layout>
    );
  }
};

module.exports = History;
