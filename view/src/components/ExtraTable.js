'use strict';

import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';

import { getUuid } from '../util/index';

const columns = [{
  title: <FormattedMessage id='buildinfo.extra.extraName' />,
  dataIndex: 'extraName',
  width: 200,
  render: value => <span className="itemName">{value}</span>,
}, {
  title: <FormattedMessage id='buildinfo.extra.extraContent' />,
  dataIndex: 'extraContent',
  render: value => <pre>{JSON.stringify(value, null, 2)}</pre>,
}];

export default class ExtraTable extends React.Component {
  state = {
    loading: false,
  };

  render () {
    return (
      <Table columns={columns}
        rowKey={record => getUuid()}
        dataSource={this.props.data}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        size="small"
        bordered
      />
    );
  }
}
