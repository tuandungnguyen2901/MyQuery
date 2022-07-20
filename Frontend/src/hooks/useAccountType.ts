import { getUser } from '@/services/auth.service';
import { useLocation, useNavigate } from 'react-router-dom';

const usePermission = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const checkRole = async () => {
    //cua nguoi dung
    try {
      const currentUserId = window.localStorage.getItem('userId');

      if (!currentUserId) {
        return 'guess';
      }

      if (location.pathname.substring(1) === currentUserId) {
        return 'user';
      }

      const res = await getUser('currentUserId');
      if (res?.data[0].account_type === 'tutor') {
        return 'tutor';
      }

      return 'student';
    } catch (error) {
      console.log('error');
      navigate('/*', { replace: true });
    }
  };
  return checkRole;
};

export default usePermission;
