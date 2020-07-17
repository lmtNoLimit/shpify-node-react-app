import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import {
  useDispatch,
  useSelector,
  shallowEqual,
  RootStateOrAny,
} from 'react-redux';
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
  notification,
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { _createPage } from 'services/shopifyApi';
import { PageActions } from 'store/actions';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

interface FormData {
  title: string;
  published: boolean;
  template_suffix: string;
  body_html: any;
}

const PageCreate: React.FC<Page> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector(
    (state: RootStateOrAny) => state.pageReducer,
    shallowEqual
  );

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState<FormData>({
    title: '',
    published: false,
    template_suffix: '',
    body_html: editorState,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(PageActions.getPages());
  }, [dispatch]);

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
    try {
      setLoading(true);
      await _createPage(formData);
      history.push('/pages');
    } catch (error) {
      setLoading(false);
      console.log(error?.response);
      notification.error({
        message: 'Error',
        description: 'Failed to create page. Please try again',
      });
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
              onChange={(e: RadioChangeEvent) =>
                setFormData({ ...formData, published: e.target.value })
              }
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
