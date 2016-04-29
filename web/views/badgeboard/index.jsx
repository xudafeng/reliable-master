

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
