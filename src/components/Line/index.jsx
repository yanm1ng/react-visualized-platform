import React from 'react';
import ReactDOM from 'react-dom';
import cities from '../../config/city.js';
import {
  DatePicker,
  Select,
  message
} from 'antd';
import AV from 'leancloud-storage';
import { timeFormat } from '../../common/convert.js';
const { RangePicker } = DatePicker;
const Option = Select.Option;

import './index.scss';

AV.init({
  appId: 'SiuLQajWrKuR3zDPRzfAOV1L-gzGzoHsz',
  appKey: '8pYRy3bB7zDxolBkT5WyGOQJ'
});

const options = function () {
  let options = [];
  for (let i = 0; i < cities.length; i++) {
    options.push(
      <Option key={cities[i].name}>{cities[i].name}</Option>
    );
  }
  return options;
}();

export default class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: [],
      selected: []
    }
    this.chart = {}
  }
  componentDidMount() {
    this.chart = echarts.init(document.getElementById('main'), 'macarons');
  }
  componentDidUpdate() {
    this.renderCharts();
  }
  getDateRange = (range) => {
    this.setState({
      range
    })
  }
  handleSelect = (selected) => {
    this.setState({
      selected
    })
  }
  renderCharts = () => {
    const {
      range,
      selected
    } = this.state;

    if (range.length > 0 && selected.length > 0) {
      this.chart.showLoading();
      var query = new AV.Query('FogData');
      
      var startQuery = new AV.Query('FogData');
      startQuery.greaterThanOrEqualTo('createdAt', new Date(range[0] + ' 00:00:00'));
      var endQuery = new AV.Query('FogData');
      endQuery.lessThan('createdAt', new Date(range[1] + ' 00:00:00'));

      var query = AV.Query.and(startQuery, endQuery);
      query.find().then(function (results) {
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            var data = results[i].attributes.data;
            var time = results[i].attributes.time;

          }
        }
      }, function (error) {
      });
    } else {
      message.info('请选择日期区间和对比城市');
    }
  }
  render() {
    return (
      <div className="container">
        <div>
          <span>请选择雾霾数据日期和城市：</span>
          <RangePicker onChange={(date, dateString) => this.getDateRange(dateString)} />
          <Select className="myselecter" multiple placeholder="选择对比城市" onChange={(selected) => this.handleSelect(selected)}>
            {options}
          </Select>
        </div>
        <div id="main"></div>
      </div>
    );
  }
}