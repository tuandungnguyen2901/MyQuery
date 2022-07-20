import '@/App.scss';
import AppLayout from '@/components/Layout/AppLayout';
import { routePaths } from '@/const/routePaths';
import MyRoutes from '@/routes/MyRoutes';
import { getUser } from '@/services/auth.service';
import { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';

function App() {
  const Wrapper = ({ children }: any) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children;
  };

  const AuthWrapper = ({ children }: any) => {
    const locationPath = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
      const myUserId = localStorage.getItem("userId");
      const myToken = localStorage.getItem("myQueryToken");

      if (myToken && myUserId) {
        getUser(myUserId).then((res) => {
          if (res?.data?.status_code === 1003) {
            navigate(routePaths.COMPLETE_PROFILE);
          }
        });
      } else {
        if (locationPath === routePaths.MESSENGER) {
          navigate(routePaths.SIGN_IN_PAGE, { replace: true });
        }
      }
    }, [locationPath, navigate]);

    return children;
  };

  return (
    <BrowserRouter>
      <Wrapper>
        <AppLayout>
          <AuthWrapper>
            <MyRoutes />
          </AuthWrapper>
        </AppLayout>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
