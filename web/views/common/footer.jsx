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

'use strict';

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="text-center">
          &copy;{new Date().getFullYear()}&nbsp;<a target="_blank" href={this.props._options.pkg.homepage}>{this.props._options.site.title || this.props._options.pkg.name}</a>
        </div>
      </footer>
    );
  }
}

module.exports = Footer;
