'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Row,
  Col,
  Card,
  Breadcrumb,
} from 'antd';

import ReliableLayout from '../components/ReliableLayout';
import DingdingSetting from '../components/DingdingSetting';

import pkg from '../../package.json';

import './Setting.less';

export default class Setting extends React.Component {

  render () {
    return (
      <ReliableLayout>
        <Breadcrumb style={{ marginBottom: '10px' }}>
          <Breadcrumb.Item>
            <Link to="/">
              <FormattedMessage id='sidebar.homepage' />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id='sidebar.setting' />
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{ marginTop: 10 }} title={<FormattedMessage id='setting.dingMessage' />}>
          <Row>
            <Col data-accessibilityid="dingtalk-webhooks">
              <DingdingSetting />
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 10 }} title={<FormattedMessage id='setting.versioning' />}>
          <Row>
            <Col>
              reliable-web: { window.pageConfig.version }
            </Col>
          </Row>
        </Card>
      </ReliableLayout>
    );
  }
}

