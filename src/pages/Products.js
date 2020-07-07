import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Table, Space, Button, PageHeader } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ProductActions } from 'store/actions';

const Products = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
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
      title: 'Action',
      key: 'action',
      render: (page) => (
        <Space size='middle'>
          <Button
            icon={<SettingOutlined />}
            // onClick={() => showPageSettingModal(page)}
          />
        </Space>
      ),
    },
  ];

  const productState = useSelector(
    (state) => state.productReducer,
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ProductActions.getProducts());
  }, [dispatch]);

  const { products, loading } = productState;
  const data =
    products &&
    products.map((product) => ({
      key: product.id,
      ...product,
    }));

  console.log(data);

  return (
    <>
      <PageHeader
        title='Products'
        style={{ paddingLeft: 0, paddingRight: 0 }}
      />
      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
};

export default Products;
