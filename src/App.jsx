import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MedicineList from './pages/medicines/MedicineList';
import Alerts from './pages/alerts/Alerts';
import PharmacistList from './pages/admin/PharmacistList';
import AddPharmacist from './pages/admin/AddPharmacist';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="medicines" element={<MedicineList />} />
              <Route path="alerts" element={<Alerts />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin/pharmacists" element={<PharmacistList />} />
                <Route path="admin/pharmacists/add" element={<AddPharmacist />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
