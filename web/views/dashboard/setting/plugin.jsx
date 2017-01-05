'use strict';

const React = require('react');

class Plugin extends React.Component {
  pluginContent() {
    return this.props.pluginList.map(plugin => {
      return (
        <li key={plugin.name}>
          <a href={plugin.url}>{plugin.name}</a>
        </li>
      );
    });
  }

  render() {
    return (
      this.props.pluginList.length ? (
        <div className="panel list">
          <h4>{this.props.gettext('page.plugin.title')}</h4>
          <ul className="list-unstyled">
            {this.pluginContent()}
          </ul>
        </div>
      ) : null
    );
  };
}

module.exports = Plugin;
