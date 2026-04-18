import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

export const ProtectedRoute = () => {
  const { authSession, loading } = useStore();

  if (loading) return <div>Loading...</div>;

  if (!authSession) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
