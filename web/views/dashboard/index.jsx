

'use strict';

const React = require('react');

const Mail = require('./mail');
const User = require('./user');
const Topbar = require('./topbar');
const Setting = require('./setting');
const Project = require('./project');
const Layout = require('../common/layout');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderContent() {
    const catelog = this.props.page.catelog;

    if (catelog === 'user') {
      return <User {...this.props} />;
    } else if (catelog === 'setting') {
      return <Setting {...this.props} />;
    } else if (catelog === 'mail') {
      return <Mail {...this.props} />;
    } else {
      return <Project {...this.props} />;
    }
  }

  render() {
    return (
      <Layout {...this.props}>
        <Topbar {...this.props} />
        {this.renderContent()}
      </Layout>
    );
  }
};

module.exports = Dashboard;
