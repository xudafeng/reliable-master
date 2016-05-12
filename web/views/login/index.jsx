'use strict';

const React = require('react');

const Content = require('./content');
const Layout = require('../common/layout');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout {...this.props}>
        <div className="container content-wrapper">
          <Content {...this.props} />
        </div>
      </Layout>
    );
  }
}

module.exports = Login;

