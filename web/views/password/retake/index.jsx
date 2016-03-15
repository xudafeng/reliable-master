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

class Retake extends React.Component {

  render() {
    return (
      <div className="retake panel list">
        <form className="form-horizontal" id="register_form">
          <h4>{this.props.gettext('page.global.inputEmail')}</h4>
          <div className="form-group">
            <div className="col-sm-12">
              <input type="email" className="form-control" name="email"
                     placeholder="Email"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-10">
              <button type="submit" className="btn btn-default" id="sendEmail">{this.props.gettext('page.global.sendEmail')}</button>
            </div>
          </div>
        </form>
        <div className="modal fade" id="dialog" role="dialog">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="closIe" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title">
                  {this.props.gettext('page.global.tips')}
                </h4>
              </div>
              <div className="modal-body" id="dialog-content"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Retake;
