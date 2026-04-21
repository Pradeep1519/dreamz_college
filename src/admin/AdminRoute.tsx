// src/admin/AdminRoute.tsx

import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
  const adminEmail = localStorage.getItem('admin_email');
  
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
}