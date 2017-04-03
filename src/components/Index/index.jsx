import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'map',
    }
  }
  componentDidMount() {
    var arr = window.location.hash.split('/');
    var current = arr[2];
    this.setState({
      current
    });
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    });
    window.location.hash = '#index/' + e.key;
  }
  render() {
    return (
      <Menu onClick={(e) => this.handleClick(e)} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="map">
          <Icon type="compass" />全国城市
        </Menu.Item>
        <Menu.Item key="city">
          <Icon type="flag" />所有城市
        </Menu.Item>
        <Menu.Item key="line">
          <Icon type="area-chart" />城市折线
        </Menu.Item>
      </Menu>
    );
  }
}

