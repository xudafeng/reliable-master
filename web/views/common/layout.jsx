'use strict';

const React = require('react');

const Meta = require('./meta');
const Header = require('./header');
const Footer = require('./footer');

class Layout extends React.Component {
  render() {
    return (
      <html>
        <Meta {...this.props}/>
        <body>
          <input type="hidden" id="csrf_token" value={this.props.csrf}/>
          <Header {...this.props}/>
          <div id="content">
            {this.props.children}
          </div>
          <Footer {...this.props}/>
          <script src="/javascript/index.js"></script>
          <script src={`/javascript/${this.props.page.name}.js`}></script>
        </body>
      </html>
    );
  }
}

module.exports = Layout;
