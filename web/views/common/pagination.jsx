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

class Pagination extends React.Component {

  renderPageNo() {
    var pageStart = this.props.page.pagination.start;
    var pageEnd = this.props.page.pagination.end;
    var result = [];
    for (let i = pageStart; i < pageEnd; i++) {
      result.push(<li className={this.props.page.pagination.current === i ? 'active' : null}><a className="page" href="#" data-page={i}>{i}</a></li>);
    }
    return result;
  }

  render() {
    if (this.props.page.pagination.total <= 1) {
      return null;
    }
    return (
      <nav className="pagination-nav">
        <ul className="pagination pull-right">
          <li className={this.props.page.pagination.previous ? null : 'disabled'}>
            <a className="page" data-page={this.props.page.pagination.previous} href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {this.renderPageNo()}
          <li className={this.props.page.pagination.next ? null : 'disabled'}>
            <a className="page" data-page={this.props.page.pagination.next} href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

module.exports = Pagination;
