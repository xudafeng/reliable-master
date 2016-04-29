

'use strict';

const React = require('react');

class Content extends React.Component {

  render() {
    return (
      <div className="auth panel list">
        <form className="form-horizontal" id="register_form">
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.user.user_name')}</label>

            <div className="col-sm-10">
              <input type="text" className="form-control" name="user_name" value={this.props.user.user_name}
                     placeholder="User Name"/>
              <input type="hidden" name="oauth_id" value={this.props.user.oauth_id} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.user.nick_name')}</label>

            <div className="col-sm-10">
              <input type="text" className="form-control" name="nick_name" value={this.props.user.nick_name} placeholder="Nick Name"/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.global.email')}</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" name="email" value={this.props.user.email} placeholder="Email"/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">{this.props.gettext('page.global.password')}</label>

            <div className="col-sm-10">
              <input type="password" className="form-control" name="password" placeholder="Password"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" id="submit_register">{this.props.gettext('page.global.register')}</button>
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

module.exports = Content;
