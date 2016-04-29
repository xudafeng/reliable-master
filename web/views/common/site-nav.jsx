

'use strict';

const React = require('react');

class SiteNav extends React.Component {

  renderUser() {
    if (this.props.session && this.props.session.user) {
      return this.renderLogin();
    } else {
      return this.renderUnlogin();
    }
  }

  addHoverByPathName(pathname) {
    return pathname === this.props.pathname ? 'hover' : null;
  }

  renderLogin() {
    return (
      <div>
        <span>{this.props.gettext('page.common.nav.hello')},</span>
        <a href="/dashboard/user" className={this.addHoverByPathName('/dashboard/user')}>{this.props.session.user.name}</a>
        <a href="/dashboard" className={this.addHoverByPathName('/dashboard')}>{this.props.gettext('page.common.nav.manager')}</a>
        <a href="/badgeboard" className="hidden">{this.props.gettext('page.global.badgeboard')}</a>
        <a href={this.props._options.site.docurl} target="_blank">{this.props.gettext('page.global.help')}</a>
        <a href="/dashboard/setting" className={this.addHoverByPathName('/dashboard/setting')}>{this.props.session.user.is_sys_admin ? this.props.gettext('page.common.nav.setting') : null}</a>
        <a href="#" className={this.props._options.site.login ? '' : 'hidden'} id="submit_logout">{this.props.gettext('page.common.nav.logout')}</a>
      </div>
    );
  }

  renderUnlogin() {
    return (
      <div>
        <a href="/dashboard" className={this.addHoverByPathName('/dashboard')}>{this.props.gettext('page.common.nav.manager')}</a>
        <a href="/badgeboard" className="hidden">{this.props.gettext('page.global.badgeboard')}</a>
        <a href={this.props._options.site.docurl} target="_blank">{this.props.gettext('page.global.help')}</a>
        <a href="/login" className={`${this.addHoverByPathName('/login')} ${this.props._options.site.login ? '' : 'hidden'}`}>{this.props.gettext('page.title.login')}</a>
        <a href="/signup" className={`${this.addHoverByPathName('/signup')} ${this.props._options.site.login ? '' : 'hidden'}`}>{this.props.gettext('page.title.signup')}</a>
      </div>
    );
  }

  render() {
    return (
      <div className="user">
        <div className="container">
        <span className="pull-left">
          <a id="macaca-logo" href="/">{this.props._options.site.title || this.props.gettext('page.title.home')}</a>
        </span>
        {this.renderUser()}
        </div>
      </div>
    );
  }
}

module.exports = SiteNav;
