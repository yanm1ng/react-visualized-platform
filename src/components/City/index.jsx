import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../Index/index.jsx';
import {
  DatePicker,
  message,
  Table,
  Icon,
  Input
} from 'antd';
const Search = Input.Search;

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
  width: 200,
  render: (record) => <a href={"http://www.baidu.com/s?ie=utf-8&wd="+ record +"%20雾霾"} target="_blank">{record}</a>
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
      dataSource: [],
      searched: false,
      searchSource: []
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
          searched: false,
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
  searchData = (value) => {
    var {
      dataSource,
      loading
    } = this.state;
    if (value == '') {
      this.setState({
        searched: false,
      })
    } else {
      this.setState({
        loading: true
      })
      var searchSource = dataSource.filter(item => {
        return item.city.indexOf(value) > -1
      })
      this.setState({
        loading: false,
        searched: true,
        searchSource
      })
    }
  }
  render() {
    const {
      loading,
      dataSource,
      searched,
      searchSource
    } = this.state;

    return (
      <div>
        <Index />
        <div className="container">
          <div>
            <span>请选择雾霾数据日期：</span>
            <DatePicker onChange={(date, dateString) => this.getDataSource(dateString)} style={{ marginRight: 20 }}/>
            <span>搜索城市：</span>
            <Search placeholder="输入城市名称" style={{ width: 200 }} onChange={(e) => this.searchData(e.target.value)} onSearch={value => this.searchData(value)}/>
            <Table className="my-table" columns={columns} dataSource={searched ? searchSource : dataSource} loading={loading}/>
          </div>
        </div>
      </div>
    );
  }
}