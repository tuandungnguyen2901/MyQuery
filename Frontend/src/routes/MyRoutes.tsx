import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { routerConfig } from '@/routes/routeConfig';
import { routePaths } from '@/const/routePaths';

export default function MyRoutes() {
  return (
    <>
      <Routes>
        {routerConfig.map((el: any) => {
          const { component, needAuthor, grantPermission, ...rest } = el;
          const Component = el?.component;
          return (
            <Route
              key={el.path}
              exact
              {...rest}
              element={<Component />}
            ></Route>
          );
        })}
        <Route path='/' element={<Navigate to={routePaths.HOME} replace />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
