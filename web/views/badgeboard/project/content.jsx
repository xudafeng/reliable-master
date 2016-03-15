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

let React = require('react');

class Content extends React.Component {

  renderTbody() {
    return this.props.project.list.map((item, i) => {
      let taskStatus = '';
      let statusBtn = item.status_name === 'open' ? this.props.gettext('page.global.close') : this.props.gettext('page.global.open');
      switch(item.status_name) {
        case 'open':
          taskStatus = <span className="label label-success">{item.status_name}</span>;
          break;
        default:
          taskStatus = <span className="label label-default">{item.status_name}</span>;
          break;
      }
      return (
        <tr title={item.description} key={item._id}>
          <th scope="row">{this.props.project.count - i - 10 * (this.props.page.pagination.current - 1)}</th>
          <td><a href={`/history/${item._id}`} target="_blank">{item.title || '-'}</a></td>
          <td>{item.last_modify_nick_name || '-'}</td>
          <td>{taskStatus || '-'}</td>
          <td className="text-right">
            <a href={`/badgeboard/${item._id}?editor=true`} target="_blank">
              <img src={`/badgeboard/${item._id}`} />
            </a>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="panel list">
        <div className="panel-body">
          <h4 className="pull-left" dangerouslySetInnerHTML={{__html: this.props.gettext('page.task.number', this.props.project.count)}}></h4>
        </div>
        <table className="table table-hover">
          <thead>
          <tr>
            <th>ID</th>
            <th>{this.props.gettext('page.global.title')}</th>
            <th>{this.props.gettext('page.global.editor')}</th>
            <th>{this.props.gettext('page.global.status')}</th>
            <th className="text-right">{this.props.gettext('page.global.badgeboard')}</th>
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
