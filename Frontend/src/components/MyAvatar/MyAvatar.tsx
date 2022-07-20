import './MyAvatar.scss';

interface AvatarProps {
  imgUrl: string;
  size: number;
}

const MyAvatar = ({ size, imgUrl }: AvatarProps) => {
  return (
    <img src={imgUrl} className='my-avatar' width={size} height={size} alt='' />
  );
};

export default MyAvatar;
