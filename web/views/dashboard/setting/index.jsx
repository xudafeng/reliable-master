'use strict';

const React = require('react');

const Admin = require('./admin');
const Content = require('./content');
const Plugin = require('./plugin');
const Pagination = require('../../common/pagination');

class Setting extends React.Component {
  render() {
    return (
      <div className="container content-wrapper">
        <Admin {...this.props} />
        <Content {...this.props} />
        <Pagination {...this.props} />
        <Plugin {...this.props} />
      </div>
    );
  };
}

module.exports = Setting;
