import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import china from '../../config/china.js';

const Chart = createG2(chart => {
  chart.polygon().position(Stat.map.region('name', china))
    .color('value', '#F4EC91-#AF303C')
    .label('name', { label: { fill: '#000', shadowBlur: 5, shadowColor: '#fff' } })
    .style({
      stroke: '#333',
      lineWidth: 1
    });
  chart.render();
});

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      forceFit: true,
      width: 500,
      height: 450,
      plotCfg: {
        margin: [50, 80]
      }
    }
  }
  componentDidMount() {
    const userData = [];
    const features = china.features;
    for (let i = 0; i < features.length; i++) {
      const name = features[i].properties.name;
      userData.push({
        "name": name,
        "value": Math.round(Math.random() * 1000)
      });
    }
    this.setState({
      data: userData
    });
  }
  render() {
    return (
      <div>
        <Chart
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
          forceFit={this.state.forceFit}
        />
      </div>
    );
  }
}