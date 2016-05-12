'use strict';

const React = require('react');

const _ = require('./utils/helper');
const config = require('./config').get();
const gettext = require('../web/resources/i18n')(config.site.locale);

const divStyle = {
  width: '80%',
  padding: '10px 20px',
  margin: '0 auto 18px',
  border: '1px solid #cfcfcf',
  borderRadius: '5px',
  backgroundClip: 'padding-box',
  backgroundColor: '#fbfbfb',
  color: 'rgb(128, 128, 128)',
  fontFamily: 'Tahoma, Arial',
  fontSize: '12px'
};

const aStyle = {
  color: '#808080',
  fontWeight: 'bold'
};

class AccountActiveMail extends React.Component {

  getCSSStyle() {
    return {
      divStyle,
      aStyle
    };
  }

  render() {
    return (
      <div style={this.getCSSStyle().divStyle}>
        <p>{gettext('page.common.nav.hello')}:</p>
        <p>{gettext('email.register.welcome', this.props.name)}</p>
        <a style={this.getCSSStyle().aStyle} href={this.props.link}>{this.props.name}</a>
        <p>{gettext('email.register.sorry', this.props.name)}</p>
        <p>{gettext('email.register.sincerely', this.props.name)}</p>
      </div>
    );
  }
}

class ResetPasswordMail extends React.Component {

  getCSSStyle() {
    return {
      divStyle,
      aStyle
    };
  }

  render() {
    return (
      <div style={this.getCSSStyle().divStyle}>
        <p>{gettext('page.common.nav.hello')}:</p>
        <p>{gettext('email.register.resetPassword', this.props.name)}</p>
        <a style={this.getCSSStyle().aStyle} href={this.props.link}>{gettext('email.register.resetLink')}</a>
        <p>{gettext('email.register.sorry', this.props.name)}</p>
        <p>{gettext('email.register.sincerely', this.props.name)}</p>
      </div>
    );
  }
}

class TaskEndMail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.formatExtraData();
  }

  formatExtraData() {
    var data = null;

    try {
      data = JSON.parse(this.props.task.extra);
    } catch (e) {
      console.log(e);
    }

    this.extra = data ? data : {};
  }

  getCSSStyle() {

    var aStyle = {
      color: '#3c763d',
      fontWeight: 'bold',
      float: 'left',
      width: '60%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    };

    var resultStyle = {
      width: '80%',
      backgroundColor: '#dff0d8',
      color: '#3c763d',
      padding: '10px 20px',
      margin: '0 auto 18px',
      border: '1px solid #d6e9c6',
      borderRadius: '4px',
      lineHeight: '1.8'
    };

    var info = _.clone(divStyle);
    info.fontSize = '14px';

    if (this.props.task.status_name === 'failed') {
      resultStyle.backgroundColor = '#f2dede';
      resultStyle.color = '#a94442';
      resultStyle.border = '1px solid #ebccd1';
      aStyle.color = '#a94442';
    }

    var floatRight = {
      float: 'right'
    };

    var clearBoth = {
      clear: 'both'
    };

    return {
      aStyle,
      resultStyle,
      info,
      floatRight,
      clearBoth
    };
  }

  render() {
    return (
      <div>
        <div style={this.getCSSStyle().resultStyle}>
          <a style={this.getCSSStyle().aStyle} href={this.props.taskUrl}>{this.props.task.title}</a>
          <div style={this.getCSSStyle().floatRight}>
            <span>
              <i></i>
              {this.props.task.duration}
            </span>
          </div>
          <div style={this.getCSSStyle().clearBoth}>
            {this.props.task.status_name}
            <div style={this.getCSSStyle().floatRight}>
              {this.props.task.start_date}
            </div>
          </div>
        </div>
        <div style={this.getCSSStyle().info}>
          <h4>
            information
          </h4>
          <p>
            <span>Passing: </span>
            {this.extra.passing}
          </p>
          <p>
            <span>Failing: </span>
            {this.extra.failing}
          </p>
          <p>
            <span>CommitId: </span>
            {this.extra.description && this.extra.description.commitId || ''}
          </p>
          <p>
            <span>Subject: </span>
            {this.extra.description && this.extra.description.subject || ''}
          </p>
          <p>
            <span>Author: </span>
            {this.extra.description && this.extra.description.author || ''}
          </p>
          <p>
            <span>Branch: </span>
            {this.extra.description && this.extra.description.branch || ' '}
          </p>
        </div>
      </div>
    );
  }
}

class SiteNotice extends React.Component {

  getCSSStyle() {
    return {
      aStyle: {
        color: '#1e1e1e',
        fontFamily: 'Segoe WPC , Segoe UI , SFUIText-Light , HelveticaNeue-Light , sans-serif , Droid Sans Fallback',
        textDecoration: 'none'
      },
      style1: {
        padding: '6px',
        border: '4px solid #dddddd;',
        marginTop: '30px'
      },
      style2: {
        padding: '10px'
      },
      style3: {
        fontFamily: 'Segoe WPC , Segoe UI , SFUIText-Light , HelveticaNeue-Light , sans-serif , Droid Sans Fallback',
        background: '#f8f8f8',
        padding: '0 20px;'
      },
      style4: {
        color: '#000',
        fontSize: '20px',
        lineHeight: '1',
        textAlign: 'center',
        borderBottom: '1px solid #dddddd;',
        padding: '20px 0'
      },
      style5: {
        padding: '20px 0',
        color: '#1e1e1e',
        fontSize: '16px',
        lineHeight: '1.8'
      },
      style6: {
        height: '50px',
        marginTop: '50px',
        fontSize: '14px'
      },
      style7: {
        float: 'right',
        textAlign: 'right'
      }
    };
  }

  render() {
    return (
      <a href={this.props.link} target="_blank" style={this.getCSSStyle().aStyle}>
        <div style={this.getCSSStyle().style1}>
          <div style={this.getCSSStyle().style2}>
            <img height="35" src={config.mail.sloganImage}/>
          </div>
          <div style={this.getCSSStyle().style3}>
            <h2 style={this.getCSSStyle().style4}>
              {this.props.subject}
            </h2>
            <div style={this.getCSSStyle().style5} dangerouslySetInnerHTML={{__html: this.props.content}}>
            </div>
            <div style={this.getCSSStyle().style6}>
              <div style={this.getCSSStyle().style7}>{gettext('email.register.sincerely', this.props.name)}<br/>{this.props.date}</div>
            </div>
          </div>
        </div>
      </a>
    );
  }
}

exports.SiteNotice = SiteNotice;
exports.TaskEndMail = TaskEndMail;
exports.AccountActiveMail = AccountActiveMail;
exports.ResetPasswordMail = ResetPasswordMail;
