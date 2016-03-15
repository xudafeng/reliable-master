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

const _ = require('../../../../common/utils/helper');

class Content extends React.Component {
  render() {
    return (
      <div className="">
        <form id="email-form" className="form-horizontal" action={`?_csrf=${this.props.csrf}`} method="post" >
          <div className="form-group">
            <label for="title" className="control-label">{this.props.gettext('page.global.title')}:</label>
            <input name="title" className="form-control" required />
          </div>
          <div className="form-group">
            <label for="content" className="control-label">{this.props.gettext('page.global.content')}:</label>
            <textarea rows="4" name="content" className="form-control" required></textarea>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-default pull-right">Send</button>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = Content;
