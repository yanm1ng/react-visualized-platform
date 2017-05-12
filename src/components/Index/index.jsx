import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';
import Cookie from '../../common/cookie.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './index.scss';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    var current = window.location.hash.split('/')[1].split('?')[0];

    this.state = {
      current
    }
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    });
    window.location.hash = '#' + e.key;
  }
  logout = () => {
    Cookie.set('login', false);
    window.location.hash = '#/login/'
  }
  render() {
    return (
      <div className="header">
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
        <div className="logout" onClick={() => this.logout()}><Icon type="logout" /> 退出登录</div>
      </div>
    );
  }
}

