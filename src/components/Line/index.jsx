import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../Index/index.jsx';

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
  disabledDate = (e) => {
    return e && e.valueOf() > Date.now();
  }
  renderCharts = () => {
    let that = this;
    const {
      range,
      selected
    } = that.state;

    if (range.length > 0 && selected.length > 0) {
      this.chart.showLoading();
      var query = new AV.Query('FogData');

      var startQuery = new AV.Query('FogData');
      startQuery.greaterThanOrEqualTo('createdAt', new Date(range[0] + ' 00:00:00'));
      var endQuery = new AV.Query('FogData');
      endQuery.lessThanOrEqualTo('createdAt', new Date(range[1] + ' 00:00:00'));

      var query = AV.Query.and(startQuery, endQuery);
      query.find().then(function (results) {
        if (results.length > 0) {
          var series = [];
          var timeline = [];
          var values = {};

          for (let i = 0; i < results.length; i++) {
            var {
              data,
              time
            } = results[i].attributes;

            for (let j = 0; j < selected.length; j++) {
              var city = selected[j];
              for (let k = 0; k < data.length; k++) {
                if (data[k].name === city) {
                  if (!values[city]) {
                    values[city] = [];
                    values[city].push(data[k].value);
                  } else {
                    values[city].push(data[k].value);
                  }
                }
              }
            }
            timeline.push(time);
          }
          for (let i = 0; i < selected.length; i++) {
            series.push({
              name: selected[i],
              type: 'line',
              stack: 'PM2.5',
              data: values[selected[i]]
            })
          }
          var option = {
            title: {
              text: 'PM 2.5城市对比图'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: selected
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: timeline
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: series
          }
          that.chart.setOption(option);
          that.chart.hideLoading();
        }
      }, function (error) {
      });
    } else {
      message.info('请选择日期区间和对比城市');
      that.chart.hideLoading();
    }
  }
  render() {
    return (
      <div>
        <Index />
        <div className="container">
          <div>
            <span>请选择雾霾数据日期和城市：</span>
            <RangePicker disabledDate={(e) => this.disabledDate(e)} onChange={(date, dateString) => this.getDateRange(dateString)} />
            <Select className="myselecter" multiple placeholder="选择对比城市" onChange={(selected) => this.handleSelect(selected)}>
              {options}
            </Select>
          </div>
          <div id="main"></div>
        </div>
      </div>
    );
  }
}