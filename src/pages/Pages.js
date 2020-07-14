import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Tag, Space, Button, PageHeader } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { PageActions } from 'store/actions';
import { Link } from 'react-router-dom';

const Pages = () => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Template Suffix',
      dataIndex: 'template_suffix',
      key: 'template_suffix',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Status',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (status) => {
        const text = status ? 'Published' : 'Unpublished';
        const color = status ? 'success' : 'default';
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (page) => (
        <Space size='middle'>
          <Button
            icon={<SettingOutlined />}
            onClick={() => history.push(`pages/${page.id}`)}
          />
        </Space>
      ),
    },
  ];

  const dispatch = useDispatch();
  const history = useHistory();

  const pageState = useSelector((state) => state.pageReducer, shallowEqual);

  useEffect(() => {
    dispatch(PageActions.getPages());
  }, [dispatch]);

  const { pages, loading } = pageState;
  const data =
    pages &&
    pages.map((page) => ({
      key: page.id,
      ...page,
    }));

  return (
    <>
      <PageHeader
        title='Pages'
        extra={[
          <Link to='/pages/create' type='primary' key='create'>
            Create a Page
          </Link>,
        ]}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      />
      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
};

export default Pages;
