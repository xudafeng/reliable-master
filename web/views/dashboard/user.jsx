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

class User extends React.Component {
  render() {
    return (
      <div className="container content-wrapper">
        <div className="panel">
          <dl className="dl-horizontal user-info">
            <dt>{this.props.gettext('page.user.user_name')}：</dt>
            <dd>{this.props.session.user.userid || this.props.session.user.user_name}</dd>
            <dt>{this.props.gettext('page.user.nick_name')}：</dt>
            <dd>{this.props.session.user.cname || this.props.session.user.name}</dd>
            <dt>{this.props.gettext('page.user.email')}：</dt>
            <dd>{this.props.session.user.email}</dd>
            <dt>{this.props.gettext('page.global.dep')}：</dt>
            <dd>{this.props.session.user.dep}</dd>
          </dl>
        </div>
      </div>
    );
  }
}

module.exports = User;
