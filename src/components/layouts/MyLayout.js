import React from 'react';

import { Layout } from 'antd';

import MyMenu from './MyMenu';

const { Header, Content, Footer } = Layout;

const MyLayout = ({ children }) => {
  return (
    <Layout>
      <MyMenu />
      <Layout>
        <Header
          className='site-layout-sub-header-background'
          style={{ padding: 0 }}
        />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, minHeight: '80vh' }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
