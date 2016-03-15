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

class Reset extends React.Component {

  renderNormal() {
    return (
      <div className="reset panel list">
        <form className="form-horizontal" id="register_form">
          <h4>{this.props.gettext('page.global.resetPassword')}</h4>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.global.password')}</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" name="password" placeholder="Password"/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.global.password.confirm')}</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" name="confirm" placeholder="Confirm password"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" id="resetPwd">{this.props.gettext('page.global.reset')}</button>
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

  renderError() {
    return (
      <div className="reset panel list">
        <form className="form-horizontal" id="register_form">
          <h3>{this.props.gettext('page.global.resetPassword')}</h3>
          <h4>{this.props.gettext('page.global.tokenExpiredTip')}</h4>
          <a href='/password/retake'>{this.props.gettext('page.global.retake')}</a>
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

  render() {
    if (this.props.user) {
      return this.renderNormal();
    } else {
      return this.renderError();
    }
  }
}

module.exports = Reset;
