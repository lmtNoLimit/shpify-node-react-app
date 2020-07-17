import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useDispatch,
  useSelector,
  shallowEqual,
  RootStateOrAny,
} from 'react-redux';
import { Card, Input, Form, Button, Divider, Select, notification } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { _updateProduct } from 'services/shopifyApi';
import { PageActions } from 'store/actions';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import _ from 'lodash';
import axios from 'axios';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Option } = Select;

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

const ProductDetail = (props: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector(
    (state: RootStateOrAny) => state.pageReducer,
    shallowEqual
  );
  const { pages } = pageState;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [formData, setFormData] = useState({
    title: '',
    published: false,
    template_suffix: 'page',
    body_html: '',
  });

  useEffect(() => {
    dispatch(PageActions.getPages());
    // dispatch(PageActions.getPage(props.match.params.id));
    axios({
      method: 'GET',
      url: `/shopify/api/products/${props.match.params.id}.json`,
    }).then((res) => {
      const { product } = res.data;
      console.log(product);
      setFormData({
        ...formData,
        title: product.title,
        template_suffix: product.template_suffix,
        body_html: product.body_html,
      });
      const blocksFromHTML = convertFromHTML(product.body_html);
      product.body_html &&
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            )
          )
        );
    });

    // eslint-disable-next-line
  }, [dispatch, props.match.params.id]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeTemplate = (value: string) => {
    setFormData({
      ...formData,
      template_suffix: value,
    });
  };

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
    setFormData({
      ...formData,
      body_html: stateToHTML(editorState.getCurrentContent()),
    });
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      await _updateProduct(props.match.params.id, formData);
      history.push('/products');
    } catch (error) {
      console.log(error?.response);
      notification.error({
        message: 'Error',
        description: 'Failed to update page. Please try again',
      });
    }
  };

  return (
    <Form
      layout='vertical'
      onFinish={handleSubmit}
      initialValues={{ ...formData }}
    >
      <Card title='Product detail' bordered={false}>
        <Form.Item
          label='Title'
          name='title'
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input name='title' value={formData.title} onChange={handleChange} />
        </Form.Item>
        <Editor
          editorState={editorState}
          editorClassName='wysiwyg-editor'
          onEditorStateChange={onEditorStateChange}
        />
      </Card>

      <Card title='Template' bordered={false} style={{ marginTop: '24px' }}>
        <Select
          onChange={handleChangeTemplate}
          style={{ width: '100%' }}
          // name='template_suffix'
          value={formData.template_suffix}
        >
          <Option value='page'>page</Option>
          {_.uniqBy(pages, 'template_suffix').map((page: any) => (
            <Option key={page.id} value={page.template_suffix}>
              {page.template_suffix}
            </Option>
          ))}
        </Select>
      </Card>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' htmlType='submit'>
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default ProductDetail;
