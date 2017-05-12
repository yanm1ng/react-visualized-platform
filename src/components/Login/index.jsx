import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import cookie from '../../common/cookie.js';
const FormItem = Form.Item;
import './index.scss';

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.username == 'root' && values.password == 'root') {
          cookie.set('login', true)
          window.location.hash = '#/map'
        } else {
          message.error('登录失败')
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          <a>测试账号：root 密码：root</a>
        </FormItem>
      </Form>
    );
  }
}

export default Login = Form.create()(Login);
