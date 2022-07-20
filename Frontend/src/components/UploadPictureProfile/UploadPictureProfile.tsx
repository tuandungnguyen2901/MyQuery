import { Icon } from '@iconify/react';
import { FormInstance } from 'antd';
import { FunctionComponent, useState } from 'react';
import LoadingPicture from '@/assets/pictures/loading.gif';
import DefaultPictureProfile from '@/assets/pictures/default-picture-profile.jpg';
import './UploadPictureProfile.scss';

interface UploadPictureProfileProps {
  form: FormInstance;
  size: number;
}

const UploadPictureProfile: FunctionComponent<UploadPictureProfileProps> = ({
  form,
  size,
}) => {
  const [pictureProfile, setPictureProfile] = useState(() =>
    form.getFieldValue('pictureProfile')
      ? form.getFieldValue('pictureProfile')
      : ''
  );

  const uploadPhotoHandler = async (e: any) => {
    const file = e.target.files[0];
    try {
      setPictureProfile(LoadingPicture);
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
        .then((result) => {
          form.setFieldsValue({ pictureProfile: result.url });
          setPictureProfile(result.url);
        })
        .catch((error) => console.log('error', error));
    } catch (error) {}
  };

  return (
    <div className='upload-picture-profile'>
      <img
        src={`${pictureProfile ? pictureProfile : DefaultPictureProfile}`}
        alt=''
        className='picture-profile'
        width={size}
        height={size}
      />
      <label htmlFor='upload-photo' className='upload-photo-btn'>
        {<Icon icon='carbon:cloud-upload' color='#373737' />}
        {<span>Upload photo</span>}
      </label>
      <input
        type='file'
        name=''
        id='upload-photo'
        onChange={uploadPhotoHandler}
      />
    </div>
  );
};

export default UploadPictureProfile;
