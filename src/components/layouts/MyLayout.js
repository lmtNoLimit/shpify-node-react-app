import React from 'react';

import { Layout } from 'antd';

import MyMenu from './MyMenu';

const { Header, Content } = Layout;

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
            style={{ padding: 24, minHeight: '90vh' }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
