import React from 'react';
import ReactDOM from 'react-dom';
import {
  DatePicker,
  message
} from 'antd';
import AV from 'leancloud-storage';
import { convertData, timeFormat } from '../../common/convert.js';
import geoCoordMap from '../../config/map.js';

AV.init({
  appId: 'SiuLQajWrKuR3zDPRzfAOV1L-gzGzoHsz',
  appKey: '8pYRy3bB7zDxolBkT5WyGOQJ'
});

import './index.scss';

function randomData() {
  return Math.round(Math.random() * 1000);
}

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: {
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        title: [
          {
            text: '全国主要城市 PM 2.5',
            subtext: 'data from datacenter.mep.gov.cn',
            sublink: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action?xmlname=1462259560614',
            left: 'center',
            textStyle: {
              color: '#404040'
            }
          },
          {
            id: 'statistic',
            right: 120,
            top: 40,
            width: 100,
            textStyle: {
              color: '#404040',
              fontSize: 16
            }
          }
        ],
        // 视觉映射组件
        visualMap: {
          min: 0,
          max: 200,
          splitNumber: 5,
          // calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
          textStyle: {
            color: '#fff'
          }
        },
        // 区域选择组件小标签颜色设置
        toolbox: {
          iconStyle: {
            normal: {
              borderColor: '#fff'
            },
            emphasis: {
              borderColor: '#b1e4ff'
            }
          }
        },
        // 区域选择组件设置
        brush: {
          outOfBrush: {
            color: '#abc'
          },
          brushStyle: {
            borderWidth: 2,
            color: 'rgba(0,0,0,0.2)',
            borderColor: 'rgba(0,0,0,0.5)',
          },
          seriesIndex: [0, 1],
          throttleType: 'debounce',
          throttleDelay: 300,
          geoIndex: 0
        },
        // 地图设置
        geo: {
          map: 'china',
          left: 0,
          right: 0,
          zoom: 0.6,
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        tooltip: {
          trigger: 'item',
        },
        grid: {
          right: 40,
          top: 100,
          bottom: 40,
          width: '30%'
        },
        // x轴
        xAxis: {
          type: 'value',
          scale: true,
          position: 'top',
          boundaryGap: false,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { margin: 2, textStyle: { color: '#aaa' } },
        },
        // y轴
        yAxis: {
          type: 'category',
          nameGap: 16,
          axisLine: { show: false, lineStyle: { color: '#ddd' } },
          axisTick: { show: false, lineStyle: { color: '#ddd' } },
          axisLabel: { interval: 0, textStyle: { color: '#ddd' } },
          data: []
        },
        series: [
          // 主数据
          {
            name: 'PM2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: function (val) {
              return Math.max(val[2] / 9, 8);
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ddb926'
              }
            }
          },
          {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: function (val) {
              return Math.max(val[2] / 10, 8);
            },
            showEffectOn: 'emphasis',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          },
          {
            id: 'bar',
            zlevel: 2,
            type: 'bar',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#ddb926'
              }
            },
            data: []
          }
        ]
      }
    }
    this.chart = {};
  }
  componentDidMount = () => {
    this.chart = echarts.init(document.getElementById('main'), 'macarons');
    var today = timeFormat('yyyy-MM-dd');
    this.getChartsOptions(today);
  }
  getChartsOptions = (date) => {
    let that = this;
    that.chart.showLoading();
    var query = new AV.Query('FogData');

    query.equalTo('time', date);

    query.find().then(function (results) {
      if (results.length > 0) {
        var data = results[0].attributes.data;
        var option = that.state.option;
        var mapData = [
          convertData(geoCoordMap, data),
          convertData(geoCoordMap, data.sort(function (a, b) {
            return b.value - a.value
          }).slice(0, 6))
        ];
        console.log(mapData);
        option.series[0].data = mapData[0];
        option.series[1].data = mapData[1];

        that.chart.setOption(option);
        that.chart.hideLoading();

      } else {
        message.info('没有本日数据');
        that.chart.hideLoading();
      }
    }, function (error) {
      message.error('网络出错');
      that.chart.hideLoading();
    });
  }
  render() {
    return (
      <div className="container">
        <div>
          <span>请选择雾霾数据日期：</span>
          <DatePicker onChange={(date, dateString) => this.getChartsOptions(dateString)} />
        </div>
        <div id="main"></div>
      </div>
    );
  }
}