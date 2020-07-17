import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
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
import { _updatePage } from '../services/shopifyApi';
import { PageActions } from '../store/actions';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import _ from 'lodash';
import axios from 'axios';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Option } = Select;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

interface Props {
  match: {
    params: {
      id: string;
    };
  };
}

const PageDetail = (props: Props) => {
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
      const blocksFromHTML = page.body_html && convertFromHTML(page.body_html);
      blocksFromHTML &&
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            )
          )
        );
    });
  }, [dispatch, props.match.params.id]);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
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
      await _updatePage(props.match.params.id, formData);
      history.push('/pages');
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
              onChange={(e: RadioChangeEvent) =>
                setFormData({
                  ...formData,
                  published: e.target.value,
                })
              }
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
        <Button type='primary' htmlType='submit'>
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default PageDetail;
