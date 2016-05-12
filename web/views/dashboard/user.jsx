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
