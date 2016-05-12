'use strict';

const React = require('react');

const SiteNav = require('./site-nav');

class Header extends React.Component {
  render() {
    return (
      <header>
        <SiteNav {...this.props}/>
        <section className="container">
        </section>
      </header>
    );
  }
}

module.exports = Header;
