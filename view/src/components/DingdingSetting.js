'use strict';

import React from 'react';
import safeGet from 'lodash.get';
import uniqBy from 'lodash.uniqby';
import { FormattedMessage } from 'react-intl';
import {
  Form,
  Icon,
  Spin,
  Input,
  Button,
  Select,
  message,
} from 'antd';

import request from '../util/request';

const FormItem = Form.Item;
const Option = Select.Option;

const webhookFormItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { offset: 4, span: 16 },
  },
};
const buttonFormItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { offset: 10, span: 4 },
  },
};

class DingdingSetting extends React.Component {
  state = {
    webhooks: [],
    loading: false,
  }

  componentDidMount () {
    this.fetchWebhooks();
  }

  fetchWebhooks = async () => {
    this.setState({ loading: true });
    const res = await request('getWebhooks', 'GET');
    this.setState({ loading: false });
    if (!res.success) return;

    const webhooks = safeGet(res, 'data.webhooks');
    if (!Array.isArray(webhooks) || !webhooks.length) {
      this.setState({
        webhooks: [{
          url: '',
        }],
      });
      return;
    }

    this.setState({
      webhooks,
    });
  }

  postWebhooks = async (webhooks) => {
    const res = await request('postWebhooks', 'POST', {
      type: 'webhooks',
      webhooks,
    });
    if (res.success) {
      await this.fetchWebhooks();
      message.success('Update webhooks successfully!');
    } else {
      message.error('Update webhooks failed.');
      console.error('postWebhooks', res);
    }
  }

  removeOneNotification = index => {
    const webhooks = [
      ...this.state.webhooks,
    ];
    webhooks.splice(index, 1);
    this.setState({ webhooks });
  }

  addMoreNotification = () => {
    this.setState({
      webhooks: [
        ...this.state.webhooks,
        {
          url: '',
        },
      ],
    });
  }

  updateWebhooks = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const uniqWebhooks = uniqBy(values.webhooks, value => `${value.tag}${value.url}`);
      this.postWebhooks(uniqWebhooks);
    });
  }

  renderWebhookList = () => {
    const { getFieldDecorator } = this.props.form;
    return this.state.webhooks.map((webhook, index) => {
      const notifyTypeSelector = getFieldDecorator(`webhooks[${index}].tag`, {
        initialValue: webhook.tag || 'build',
      })(
        <Select style={{ width: 88 }}>
          <Option value="build"><FormattedMessage id="setting.notification.build" /></Option>
        </Select>
      );
      return (<FormItem
        key={index}
        {...webhookFormItemLayout}
      >
        {getFieldDecorator(`webhooks[${index}].url`, {
          validateTrigger: ['onBlur'],
          initialValue: webhook.url,
          rules: [{
            required: true,
            type: 'url',
            whitespace: true,
            message: 'Please input DingTalk webhook url.',
          }],
        })(
          <Input
            addonBefore={notifyTypeSelector}
            placeholder="webhook"
            addonAfter={
              (
                webhook.url || // committed webhook
                (index === this.state.webhooks.length - 1) // new webhook input
              ) ? (
                  <Icon
                    style={{
                      cursor: 'pointer',
                    }}
                    type="delete"
                    onClick={() => this.removeOneNotification(index)}
                  />
                ) : null
            }
          />
        )}
      </FormItem>);
    });
  }

  render () {
    return (
      <Form>
        <Spin spinning={this.state.loading}>
          {this.renderWebhookList()}
        </Spin>
        <FormItem {...webhookFormItemLayout}>
          <Button data-accessibilityid="add-notification" type="dashed" onClick={this.addMoreNotification}
            style={{ width: '100%' }}>
            <Icon type="plus" /> <FormattedMessage id='setting.addDingMessage' />
          </Button>
        </FormItem>
        <FormItem {...buttonFormItemLayout}>
          <Button
            onClick={this.updateWebhooks}
            type="primary"
            style={{ width: '100%' }}
          ><FormattedMessage id='setting.submit' /></Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(DingdingSetting);

