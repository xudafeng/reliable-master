'use strict';

import React from 'react';
import {
  Icon,
  Menu,
  Avatar,
  Layout,
  Tooltip,
  Dropdown,
} from 'antd';
import safeGet from 'lodash.get';
import { FormattedMessage } from 'react-intl';
import GitHubButton from 'react-github-button';

import 'react-github-button/assets/style.css';

import './header.less';

import { LANG_LIST as langList } from '../constants/index';

const nickName = safeGet(window, 'context.user.nick');
const Header = Layout.Header;

const pkg = require('../../package.json');

function ContentHeader (props) {
  const toggle = () => {
    props.toggleCollapsed(!props.collapsed);
  };

  const changeLang = key => {
    localStorage.RELIABLE_LANGUAGE = key;
    location.href = `/?locale=${key}`;
  };

  const currentLocale = localStorage.RELIABLE_LANGUAGE || '';
  const menu = (
    <Menu>
      {
        langList
          .filter(lang => !currentLocale || lang !== currentLocale)
          .map(lang => {
            return (
              <Menu.Item key={lang} onClick={({ key }) => {
                changeLang(key);
              }}>
                {lang}
              </Menu.Item>
            );
          })
      }
    </Menu>
  );
  return (
    <Header style={{ background: '#fff', paddingLeft: '20px' }}>
      <Icon
        className="trigger"
        type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={toggle}
      />
      <div className="right">
        <span className="github-btn-container">
          <GitHubButton
            type="stargazers"
            namespace="macacajs"
            repo="reliable"
          />
        </span>
        <Tooltip title={<FormattedMessage id='header.document' />}>
          <a
            target="_blank"
            href={ pkg.links.document }
          >
            <Icon type="book" />
          </a>
        </Tooltip>
        <Tooltip title={<FormattedMessage id='header.issues' />}>
          <a
            target="_blank"
            href={ pkg.links.issues }
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <Dropdown overlay={menu} placement="topCenter">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={ pkg.links.issues }
          >
            <Icon type="global" />
          </a>
        </Dropdown>
        {
          nickName && <Dropdown overlay={
            <Menu className="nickname-menu">
              <Menu.Item>
                <span>
                  <Icon type="user" />
                  <span>{ nickName }</span>
                </span>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={() => {
                location.href = '/snsAuthorize/signout';
              }}>
                <span>
                  <Icon type="logout" />
                  {'Sign out'}
                </span>
              </Menu.Item>
            </Menu>
          } placement="topCenter">
            <a>
              <Avatar size="small" style={{
                backgroundColor: '#f56a00',
                marginRight: '4px',
              }}>
                { nickName.substr(0, 1) }
              </Avatar>
            </a>
          </Dropdown>
        }
      </div>
    </Header>
  );
}

export default ContentHeader;
