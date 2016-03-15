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

const React = require('react');

const Reset = require('./reset');
const Retake = require('./retake');
const Layout = require('../common/layout');

class Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderContent() {
    var catelog = this.props.page.catelog;

    if (catelog === 'retake') {
      return <Retake {...this.props}/>;
    } else if (catelog === 'reset') {
      return <Reset {...this.props}/>;
    }
  }

  render() {
    return (
      <Layout {...this.props}>
        {this.renderContent()}
      </Layout>
    );
  }
};

module.exports = Password;
