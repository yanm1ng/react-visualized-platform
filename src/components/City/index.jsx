import React from 'react';
import ReactDOM from 'react-dom';
import {
  DatePicker,
  message,
  Table,
  Icon
} from 'antd';
import AV from 'leancloud-storage';
import { convertData, timeFormat } from '../../common/convert.js';

AV.init({
  appId: 'SiuLQajWrKuR3zDPRzfAOV1L-gzGzoHsz',
  appKey: '8pYRy3bB7zDxolBkT5WyGOQJ'
});

import './index.scss';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

export default class City extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    
  }
  getDataSource = (dateString) => {
    
  }
  render() {
    return (
      <div className="container">
        <div>
          <span>请选择雾霾数据日期：</span>
          <DatePicker onChange={(date, dateString) => this.getDataSource(dateString)} />
          <Table className="my-table" columns={columns} dataSource={data} />
        </div>
      </div>
    );
  }
}