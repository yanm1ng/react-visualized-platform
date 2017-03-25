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
  handleClick = (e) => {
    this.setState({
      current: e.key
    });
    window.location.hash = '#index/' + e.key;
  }
  render() {
    return (
      <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
        <Menu.Item key="map">
          <Icon type="compass" />全国城市
        </Menu.Item>
        <Menu.Item key="city">
          <Icon type="flag" />个体城市
        </Menu.Item>
      </Menu>
    );
  }
}

