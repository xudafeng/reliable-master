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

class Content extends React.Component {

  renderSocialLogin() {
    return (
      <ul id="social-login" className="clearfix">
        <li>
          <a className="btn btn-default github-btn" href="/auth/github">GitHub</a>
        </li>
        <li>
          <a className="btn btn-default gitlab-btn" href="/auth/gitlab">GitLab</a>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className="login panel list">
        <form className="form-horizontal" id="register_form">
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.user.user_name')}</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="user_name"
                     placeholder="User Id"/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.global.password')}</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" name="password"
                     placeholder="Password"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" id="submit_register">{this.props.gettext('page.global.login')}</button>
              <a id="forgot" href="/password/retake">{this.props.gettext('page.global.forgot')}</a>
            </div>
          </div>
          {this.renderSocialLogin()}
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

module.exports = Content;
