import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../Index/index.jsx';
import {
  DatePicker,
  message,
  Table,
  Icon
} from 'antd';
import AV from 'leancloud-storage';
import { timeFormat } from '../../common/convert.js';

AV.init({
  appId: 'SiuLQajWrKuR3zDPRzfAOV1L-gzGzoHsz',
  appKey: '8pYRy3bB7zDxolBkT5WyGOQJ'
});

import './index.scss';

const columns = [{
  title: '城市',
  dataIndex: 'city',
  key: 'city',
  width: 200
}, {
  title: 'PM 2.5',
  dataIndex: 'fog',
  key: 'fog',
  sorter: (a, b) => a.fog > b.fog
}];

export default class City extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dataSource: []
    };
  }
  componentDidMount = () => {
    var today = timeFormat('yyyy-MM-dd');
    this.getDataSource(today);
  }
  getDataSource = (date) => {
    let that = this;
    var {
      dataSource,
      loading
    } = that.state;
    that.setState({
      loading: true
    });

    var query = new AV.Query('FogData');

    query.equalTo('time', date);
    query.find().then(function (results) {
      if (results.length > 0) {
        var data = results[0].attributes.data;
        dataSource = [];
        for (let i = 0; i < data.length; i++) {
          dataSource.push({
            key: i,
            city: data[i].name,
            fog: data[i].value
          });
        }
        that.setState({
          loading: false,
          dataSource
        })
      } else {
        message.error('网络出错');
        that.setState({
          loading: false
        })
      }
    });
  }
  render() {
    const {
      loading,
      dataSource
    } = this.state;

    return (
      <div>
        <Index />
        <div className="container">
          <div>
            <span>请选择雾霾数据日期：</span>
            <DatePicker onChange={(date, dateString) => this.getDataSource(dateString)} />
            <Table className="my-table" columns={columns} dataSource={dataSource} loading={loading}/>
          </div>
        </div>
      </div>
    );
  }
}