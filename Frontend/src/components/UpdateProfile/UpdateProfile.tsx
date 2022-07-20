import TagsDropDown from '@/components/TagsDropDown/TagsDropDown';
import UploadPictureProfile from '@/components/UploadPictureProfile/UploadPictureProfile';
import { getAllTags } from '@/services/query.service';
import { validatePhoneNumber } from '@/utils/utils';
import { Col, DatePicker, Form, FormInstance, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import './UpdateProfile.scss';

const { Item } = Form;
const { Option } = Select;

interface UpdateProfileProps {
  form: FormInstance;
}

const UpdateProfile = ({ form }: UpdateProfileProps) => {
  const [tags, setTags] = useState<any>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await getAllTags();

      if (res?.data?.status_code === 1) {
        setTags(res?.data?.data);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className='update-profile'>
      <Item name={'pictureProfile'}>
        <UploadPictureProfile form={form} size={75} />
      </Item>
      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 0 }}>
          <Item
            label={'First Name'}
            name={'firstName'}
            style={{ margin: 0, marginBottom: 10, width: '100%' }}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input
              placeholder='-- First Name --'
              style={{ width: '100%' }}
              allowClear
            />
          </Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 2 }}>
          <Item
            name={'lastName'}
            label={'Last Name'}
            style={{ margin: 0, marginBottom: 10 }}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder='-- Last Name --' allowClear />
          </Item>
        </Col>
      </Row>

      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 0 }}>
          <Item
            label={'Phone Number'}
            name={'phoneNumber'}
            style={{ margin: 0, marginBottom: 10 }}
            validateTrigger={'onBlur'}
            rules={[
              { required: true, message: 'This field is required' },
              {
                validator: (_, v) => {
                  if (v && !validatePhoneNumber(v)) {
                    return Promise.reject(new Error('Invalid phone number.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder='-- Phone Number --' allowClear />
          </Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 2 }}>
          <Item
            label={'Date of Birth'}
            name={'dob'}
            style={{ margin: 0, marginBottom: 10 }}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <DatePicker
              placeholder='-- Select Date --'
              style={{ width: '100%' }}
              allowClear
            />
          </Item>
        </Col>
      </Row>

      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 0 }}>
          <Item
            label={'Gender'}
            name={'gender'}
            style={{ margin: 0, marginBottom: 10 }}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Select placeholder='-- Gender --' allowClear>
              <Option value='Male'>Male</Option>
              <Option value='Female'>Female</Option>
            </Select>
          </Item>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 11, offset: 2 }}>
          <Item
            label={'Location'}
            name={'location'}
            style={{ margin: 0, marginBottom: 10 }}
            rules={[{ required: true, message: 'This field is required' }]}
          >
            <Input placeholder='-- Location --' allowClear />
          </Item>
        </Col>
      </Row>

      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }}>
          <Item
            label={'Job'}
            name={'job'}
            style={{ margin: 0, marginBottom: 10 }}
          >
            <Input placeholder='-- Job Title --' allowClear />
          </Item>
        </Col>
      </Row>

      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }}>
          <TagsDropDown tags={tags} />
        </Col>
      </Row>

      <Row style={{ width: '100%' }}>
        <Col xs={{ span: 24 }}>
          <Item
            label={'Description'}
            name={'description'}
            style={{ margin: 0, marginBottom: 10 }}
          >
            <Input.TextArea
              placeholder='-- Description --'
              allowClear
              autoSize
            />
          </Item>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateProfile;
