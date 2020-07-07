import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Input,
  Form,
  Button,
  Divider,
  Radio,
  Select,
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { _updatePage, _createPage } from 'services/shopifyApi';
import { PageActions } from 'store/actions';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const AddPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector((state) => state.pageReducer, shallowEqual);

  useEffect(() => {
    dispatch(PageActions.getPages());
  }, [dispatch]);

  useEffect(() => {
    console.log(page);
  });

  const [page, setPage] = useState({
    title: '',
    published_at: null,
    template_suffix: '',
    body_html: '',
  });

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    setPage({
      ...page,
      [target.name]: value,
    });
  };

  const handleChangeTemplate = (value) => {
    setPage({
      ...page,
      template_suffix: value,
    });
  };

  const onEditorStateChange = (editorState) => {
    setPage({
      ...page,
      body_html: editorState,
    });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...page,
        body_html: draftToHtml(
          convertToRaw(page.body_html.getCurrentContent())
        ),
      };
      console.log(data);
      if (pageState.page.id) {
        await _updatePage(pageState.page.id, data);
      } else {
        await _createPage(data);
      }
      dispatch(PageActions.getPages());
      history.push('/pages');
    } catch (error) {
      console.log(error?.response);
    }
  };

  const { pages } = pageState;

  return (
    <Form layout='vertical' initialValues={{}} onFinish={handleSubmit}>
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <Card title='Page detail' bordered={false}>
            <Form.Item label='Title' name='title' rules={[{ required: true }]}>
              <Input name='title' value={page.title} onChange={handleChange} />
            </Form.Item>
            <Editor
              editorState={page.body_html}
              editorClassName='wysiwyg-editor'
              onEditorStateChange={onEditorStateChange}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Visibility' bordered={false}>
            <Radio.Group
              name='published_at'
              onChange={handleChange}
              // value={page.published}
            >
              <Radio
                style={radioStyle}
                value={Date()}
                checked={page?.published_at?.length > 0}
              >
                Visible
              </Radio>
              <Radio
                style={radioStyle}
                value={''}
                checked={page.published === ''}
              >
                Hidden
              </Radio>
            </Radio.Group>
          </Card>
          <Card title='Template' bordered={false} style={{ marginTop: '24px' }}>
            <Select
              defaultValue='page'
              onChange={handleChangeTemplate}
              style={{ width: '100%' }}
              name='template_suffix'
              value={page?.template_suffix || 'page'}
            >
              <Option value='page'>page</Option>
              {pages.map((page) => (
                <Option key={page.id} value={page.template_suffix}>
                  {page.template_suffix}
                </Option>
              ))}
            </Select>
          </Card>
        </Col>
      </Row>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <Button type='primary' htmlType='submit' onClick={handleSubmit}>
          Create
        </Button>
      </div>
    </Form>
  );
};

export default AddPage;
