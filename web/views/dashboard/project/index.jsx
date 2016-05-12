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
