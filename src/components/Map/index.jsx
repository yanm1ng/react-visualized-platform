import React from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import { Stat } from 'g2';

const Chart = createG2(chart => {
  chart.coord('theta', {
    radius: 0.8 // 设置饼图的大小
  });
  chart.legend('name', {
    position: 'bottom'
  });
  chart.tooltip({
    title: null,
    map: {
      value: 'value'
    }
  });
  chart.intervalStack()
    .position(Stat.summary.percent('value'))
    .color('name')
    .label('name*..percent', function (name, percent) {
      percent = (percent * 100).toFixed(2) + '%';
      return name + ' ' + percent;
    });
  chart.render();
  var geom = chart.getGeoms()[0]; // 获取所有的图形
  var items = geom.getData(); // 获取图形对应的数据
  geom.setSelected(items[1]); // 设置选中      
});

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: 'Microsoft Internet Explorer', value: 56.33 },
        { name: 'Chrome', value: 24.03 },
        { name: 'Firefox', value: 10.38 },
        { name: 'Safari', value: 4.77 },
        { name: 'Opera', value: 0.91 }
      ],
      forceFit: true,
      width: 500,
      height: 450
    }
  }
  render() {
    return (
      <div>
        <Chart
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          forceFit={this.state.forceFit} 
        />
      </div>
    );
  }
}