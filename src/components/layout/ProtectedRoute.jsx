import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth';

function normalizeRole(role) {
  return typeof role === 'string' ? role.toLowerCase() : '';
}

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length) {
    const role = normalizeRole(user?.role);
    const allowed = allowedRoles.map((r) => normalizeRole(r));
    if (!allowed.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
