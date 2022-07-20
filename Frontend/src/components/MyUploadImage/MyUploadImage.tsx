import { PictureOutlined } from '@ant-design/icons';
import {
  Form,
  FormInstance,
  message,
  Tooltip,
  Upload,
  UploadProps,
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import './MyUploadImage.scss';

interface MyUploadImageProps {
  form: FormInstance;
  initialImage?: any;
}

const MyUploadImage: FunctionComponent<MyUploadImageProps> = ({
  form,
  initialImage,
}) => {
  const [resultUpload, setResultUpload] = useState();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>(() =>
    initialImage
      ? [{ uid: '1', name: 'upload', status: 'done', url: initialImage }]
      : []
  );

  const beforeImageUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return false;
  };

  const uploadPhotoHandler = async (e: any) => {
    const file = e[0].originFileObj;

    try {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'iiyjshqb');

      let requestOptions: any = {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      };

      fetch(
        'https://api.cloudinary.com/v1_1/thecodingpanda/upload',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setResultUpload(result))
        .catch((error) => console.log('error', error));
    } catch (error) {}
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    if (newFileList?.length > 0) {
      uploadPhotoHandler(newFileList);
    }

    if (newFileList?.length === 0) {
    }

    setFileList(newFileList);
  };

  useEffect(() => {
    if (resultUpload) {
      form.setFieldsValue({
        image: {
          ...form.getFieldValue('image'),
          cloudinaryResponse: resultUpload,
        },
      });
    }
  }, [form, resultUpload]);

  return (
    <Form.Item name={'image'}>
      <Upload
        maxCount={1}
        listType={'picture-card'}
        beforeUpload={beforeImageUpload}
        accept='image/*'
        fileList={fileList}
        onChange={handleChange}
      >
        {fileList?.length > 0 ? null : (
          <Tooltip
            visible={tooltipVisible}
            title={'Upload image'}
            placement='bottom'
            destroyTooltipOnHide
            mouseEnterDelay={0.05}
            overlayInnerStyle={{
              fontSize: '0.6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PictureOutlined
              className='upload-button'
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            />
          </Tooltip>
        )}
      </Upload>
    </Form.Item>
  );
};

export default MyUploadImage;
