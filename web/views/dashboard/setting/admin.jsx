'use strict';

const React = require('react');

class Admin extends React.Component {

  render() {
    return (
      <div className="panel admin">
        <a target="_blank" href="/dashboard/mail" className="btn btn-warning pull-right">{this.props.gettext('page.global.send.email')}</a>
      </div>
    );
  }
}

module.exports = Admin;
