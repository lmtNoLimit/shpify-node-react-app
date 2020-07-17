import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { SnippetsOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const MyMenu = () => {
  return (
    <Sider breakpoint='lg' collapsedWidth='0'>
      <div className='logo' />
      <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
        <Menu.Item key='1' icon={<SnippetsOutlined />}>
          <Link to='/pages'>Pages</Link>
        </Menu.Item>
        <Menu.Item key='2' icon={<ShoppingOutlined />}>
          <Link to='/products'>Products</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default MyMenu;
