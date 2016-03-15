/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com),ziczhu(zic.zhu@gmail.com)
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

class Topbar extends React.Component {

  render() {
    return (
      <div id="topbar">
        <div className="sidebar-container">
          <div className="container">
            <div className="cluster-status row">
              <div className="span3 client-connection-status">
                <div className="client-connection-status">
                  <div className="panel ">
                    <h5>Connected to</h5>
                    <h4>{this.props.masterName}</h4>
                  </div>
                </div>
              </div>
              <div className="span3 issues">
                <div className="issues">
                  <div className="panel ">
                    <h5>Issues</h5>
                    <h4><a target="_blank" href={this.props._options.site.issueurl}>issues link</a></h4>
                  </div>
                </div>
              </div>
              <div className="span3 servers-connected">
                <div>
                  <div className="panel">
                    <h5>Slaves</h5>
                    <h4>{this.props.slaves} connected</h4>
                  </div>
                </div>
              </div>
              <div className="span3 plugins-available">
                <div>
                  <div className="panel ">
                    <h5>Plugins</h5>
                    <h4>{this.props._options.plugins.length} plugins</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Topbar;
