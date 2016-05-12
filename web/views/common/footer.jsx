'use strict';

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="text-center">
          &copy;{new Date().getFullYear()}&nbsp;{this.props._options.site.title || this.props._options.pkg.name}&nbsp;Powered by <a href="https://github.com/reliablejs" target="_blank">Reliable</a>
        </div>
      </footer>
    );
  }
}

module.exports = Footer;
