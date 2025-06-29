import { Preloader } from '@ui';
import {
  selectUserData,
  selectIsAuthenticated
} from '../../services/slices/userSlice';

import { useAppSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  isPublic?: boolean;
  children: React.ReactElement;
};

export function ProtectedRoute({ children, isPublic }: ProtectedRouteProps) {
  const user = useAppSelector(selectUserData);
  const isAuthChecked = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isPublic && user) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} />;
  }

  if (!isPublic && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
}
export default ProtectedRoute;
