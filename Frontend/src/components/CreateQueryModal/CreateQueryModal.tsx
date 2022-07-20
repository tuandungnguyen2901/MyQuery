import MyUploadImage from '@/components/MyUploadImage/MyUploadImage';
import TagsDropDown from '@/components/TagsDropDown/TagsDropDown';
import { addTagToQuery, createNewQuery } from '@/services/query.service';
import { PictureOutlined, TagsOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import moment from 'moment';
import { FunctionComponent, useState } from 'react';
import './CreateQueryModal.scss';

interface CreateQueryModalProps {
  tags?: any;
  callback?: any;
  closeModal?: any;
  setIsDestroyOnClose?: any;
}

const { Item } = Form;

const CreateQueryModal: FunctionComponent<CreateQueryModalProps> = ({
  tags,
  callback,
  closeModal,
}) => {
  const [formCreate] = Form.useForm();
  const [isTagSelectVisible, setIsTagSelectVisible] = useState(false);
  const [isUploadMediaShown, setIsUploadMediaShown] = useState(false);

  const onFinish = async (values: any) => {
    const data = {
      title: values.title,
      content: values.mainQuery,
      image_url: values?.image?.cloudinaryResponse?.secure_url,
      created_at: moment().unix(),
    };

    if (!values?.image?.cloudinaryResponse?.secure_url) {
      delete data.image_url;
    }

    const res = await createNewQuery(
      data,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      const tagBody = {
        tags: values.tagDropDown,
        post_id: res?.data?.data[0],
      };

      addTagToQuery(tagBody, localStorage.getItem('myQueryToken')).then(
        (res) => {
          if (res?.data?.status_code === 1) {
            callback((prev: any) => !prev);
            closeModal(false);
            formCreate.resetFields();
          }
        }
      );
    }
  };

  return (
    <div className='create-query-modal'>
      <Form layout='vertical' form={formCreate} onFinish={onFinish}>
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

        {isUploadMediaShown ? <MyUploadImage form={formCreate} /> : null}

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

export default CreateQueryModal;
