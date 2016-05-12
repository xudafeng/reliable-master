

const React = require('react');

const Content = require('./content');
const Layout = require('../common/layout');

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout {...this.props}>
        <Content {...this.props} />
      </Layout>
    );
  }
};

module.exports = Task;
