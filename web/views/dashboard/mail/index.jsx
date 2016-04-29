

'use strict';

const React = require('react');

const Content = require('./content');

class Project extends React.Component {
  render() {
    return (
      <div className="container content-wrapper">
        <Content {...this.props} />
      </div>
    );
  };
}

module.exports = Project;
