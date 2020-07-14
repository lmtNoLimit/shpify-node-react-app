import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
import { _updatePage } from 'services/shopifyApi';
import { PageActions } from 'store/actions';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import _ from 'lodash';
import axios from 'axios';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const PageDetail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector((state) => state.pageReducer, shallowEqual);
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
      url: `/shopify/api/pages/${props.match.params.id}.json`,
    }).then((res) => {
      const { page } = res.data;
      console.log(page);
      setFormData({
        title: page.title,
        published: page?.published_at?.length > 0,
        template_suffix: page.template_suffix,
        body_html: page.body_html,
      });
      page.body_html &&
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(page.body_html))
          )
        );
    });
  }, [dispatch, props.match.params.id]);

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
    console.log(formData);
    try {
      await _updatePage(props.match.params.id, formData);
      history.push('/pages');
    } catch (error) {
      console.log(error?.response);
    }
  };

  return (
    <Form
      layout='vertical'
      onFinish={handleSubmit}
      initialValues={{ ...formData }}
    >
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
                value={formData.title}
                onChange={handleChange}
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
              value={!!formData.published}
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
        <Button type='primary' htmlType='submit'>
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default PageDetail;
