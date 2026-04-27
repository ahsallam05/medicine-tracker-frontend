import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth';
import { ProtectedRoute, AppLayout } from './components/layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Alerts from './pages/Alerts';
import Pharmacists from './pages/Pharmacists';
import Forbidden from './pages/Forbidden';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="medicines" element={<Medicines />} />
              <Route path="alerts" element={<Alerts />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin/pharmacists" element={<Pharmacists />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
