import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
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
import { _createPage } from 'services/shopifyApi';
import { PageActions } from 'store/actions';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const PageCreate = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector((state) => state.pageReducer, shallowEqual);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    title: '',
    published: false,
    template_suffix: null,
    body_html: editorState,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(PageActions.getPages());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTemplate = (value) => {
    setFormData({
      ...formData,
      template_suffix: value,
    });
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setFormData({
      ...formData,
      body_html: stateToHTML(editorState.getCurrentContent()),
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await _createPage(formData);
      history.push('/pages');
    } catch (error) {
      setLoading(false);
      console.log(error?.response);
    }
  };

  const { pages } = pageState;

  return (
    <Form layout='vertical' onFinish={handleSubmit}>
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <Card title='Page detail' bordered={false}>
            <Form.Item
              label='Title'
              name='title'
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input
                name='title'
                onChange={handleChange}
                value={formData.title}
              />
            </Form.Item>
            <Editor
              editorState={editorState}
              editorClassName='wysiwyg-editor'
              onEditorStateChange={onEditorStateChange}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Visibility' bordered={false}>
            <Radio.Group
              name='published'
              onChange={handleChange}
              defaultValue={false}
            >
              <Radio style={radioStyle} value={true}>
                Visible
              </Radio>
              <Radio style={radioStyle} value={false}>
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
              value={formData.template_suffix}
            >
              <Option value='page'>page</Option>
              {_.uniqBy(pages, 'template_suffix').map((page) => (
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
        <Button type='primary' htmlType='submit' loading={loading}>
          Create
        </Button>
      </div>
    </Form>
  );
};

export default PageCreate;
