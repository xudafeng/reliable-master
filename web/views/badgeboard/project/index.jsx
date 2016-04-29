'use strict';

let React = require('react');

let Content = require('./content');
let Pagination = require('../../common/pagination');

class Project extends React.Component {
  render() {
    return (
      <div className="container content-wrapper">
        <Content {...this.props} />
        <Pagination {...this.props}/>
      </div>
    );
  };
}

module.exports = Project;
