'use strict';

const React = require('react');

class Content extends React.Component {

  renderTbody() {
    return this.props.user.list.map((item, i) => {
      let user_level = '';
      switch (item.user_level) {
        case -1:
          user_level = this.props.gettext('page.user.frozen_user');
          break;
        case 0:
          user_level = this.props.gettext('page.user.normal_user');
          break;
        case 1:
          user_level = this.props.gettext('page.user.superior_user');
          break;
        case 2:
          user_level = this.props.gettext('page.user.admin');
          break;
      }
      return (
        <tr key={item._id} title={item.description}>
          <th scope="row">{this.props.user.count - i - 10 * (this.props.page.pagination.current - 1) }</th>
          <td>{item.user_name || '-'}</td>
          <td>{item.nick_name || '-'}</td>
          <td>{item.email || '-'}</td>
          <td>{item.mobile || '-'}</td>
          <td>{user_level || '-'}</td>
          <td className="text-center">
            <div className="btn-group">
              <button className="btn btn-default btn-xs change-level" data-level={item.user_level > 1 ? 0 : 2} data-id={item._id}>{item.user_level > 1 ? this.props.gettext('page.user.degrade_to_normal') : this.props.gettext('page.user.upgrade_to_admin')}</button>
              <button className="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown">
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="change-level" data-id={item._id} data-level={!!~item.user_level ? -1 : 0} href="javascript:void(0)">
                  {!!~item.user_level ? this.props.gettext('page.user.frozen_user') : this.props.gettext('page.user.unfrozen_user')}
                  </a>
                </li>
                <li>
                  <a className="delete-user" data-id={item._id} href="javascript:void(0)">{this.props.gettext('page.user.delete')}</a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="panel list">
        <div className="panel-body">
          <h4 className="pull-left" dangerouslySetInnerHTML={{__html: this.props.gettext('page.user.member', this.props.user.count)}}></h4>
        </div>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>{this.props.gettext('page.user.user_name')}</th>
            <th>{this.props.gettext('page.user.nick_name')}</th>
            <th>{this.props.gettext('page.user.email')}</th>
            <th>{this.props.gettext('page.user.mobile')}</th>
            <th>{this.props.gettext('page.user.user_level')}</th>
            <th className="text-center">{this.props.gettext('page.global.operate')}</th>
          </tr>
          </thead>
          <tbody>
          {this.renderTbody()}
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = Content;

