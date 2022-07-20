import MyUploadImage from '@/components/MyUploadImage/MyUploadImage';
import TagsDropDown from '@/components/TagsDropDown/TagsDropDown';
import {
  addTagToQuery,
  createNewQuery,
  getAllTags,
  updateQuery,
} from '@/services/query.service';
import { PictureOutlined, TagsOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import './EditQueryModal.scss';

interface EditQueryModalProps {
  tags?: any;
  callback?: any;
  closeModal?: any;
  setIsDestroyOnClose?: any;
  initialValues: any;
}

const { Item } = Form;

const EditQueryModal: FunctionComponent<EditQueryModalProps> = ({
  callback,
  closeModal,
  initialValues,
}) => {
  const [formCreate] = Form.useForm();
  const [tags, setTags] = useState();
  const [isTagSelectVisible, setIsTagSelectVisible] = useState(() =>
    initialValues.tags.length > 0 ? true : false
  );
  const [isUploadMediaShown, setIsUploadMediaShown] = useState(() =>
    initialValues.image_url ? true : false
  );

  const onFinish = async (values: any) => {
    let data = {
      post_id: initialValues.id,
      title: values.title,
      content: values.mainQuery,
      image_url: values.image,
    };

    if (values?.image?.fileList?.length === 0) {
      data = { ...data, image_url: '' };
      setIsUploadMediaShown(false);
    }

    if (values?.image?.fileList?.length > 0) {
      data = {
        ...data,
        image_url: values?.image?.cloudinaryResponse?.secure_url,
      };
    }

    const res = await updateQuery(
      data,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      const tagBody = {
        tags: values.tagDropDown,
        post_id: initialValues.id,
      };

      addTagToQuery(tagBody, localStorage.getItem('myQueryToken')).then(
        (res) => {
          if (res?.data?.status_code === 1) {
            callback();
            closeModal(false);
            formCreate.resetFields();
          }
        }
      );
    }
  };

  /**
   * Upload img
   */

  /**
   * Upload img
   */

  useEffect(() => {
    const getTags = async () => {
      const res = await getAllTags();
      if (res?.data?.status_code === 1) {
        setTags(res?.data?.data);
      }
    };

    getTags();
  }, []);

  return (
    <div className='edit-query-modal'>
      <Form
        layout='vertical'
        form={formCreate}
        onFinish={onFinish}
        initialValues={{
          title: initialValues.title,
          mainQuery: initialValues.content,
          tagDropDown: [...initialValues.tags],
          image: initialValues.image_url,
        }}
      >
        <Item name={'title'} label={'Title'}>
          <Input placeholder='Title' style={{ borderRadius: 4 }}></Input>
        </Item>
        <Item name={'mainQuery'} label={'Query'}>
          <Input.TextArea
            placeholder='Put your query here'
            autoSize
            style={{ minHeight: 100, borderRadius: 4 }}
          ></Input.TextArea>
        </Item>

        {isTagSelectVisible ? <TagsDropDown tags={tags} /> : null}

        {isUploadMediaShown ? (
          <MyUploadImage
            form={formCreate}
            initialImage={initialValues?.image_url}
          />
        ) : null}

        <div className='optional-fields'>
          <TagsOutlined
            className='optional-item'
            onClick={() => setIsTagSelectVisible((prev) => !prev)}
          />
          <PictureOutlined
            className='optional-item'
            onClick={() => setIsUploadMediaShown((prev) => !prev)}
          />
        </div>

        <Item style={{ marginBottom: 10 }}>
          <div
            className='create-submit-btn'
            onClick={() => formCreate.submit()}
          >
            Post
          </div>
        </Item>
      </Form>
    </div>
  );
};

export default EditQueryModal;
