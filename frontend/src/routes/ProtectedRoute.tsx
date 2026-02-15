
import React from 'react';
// FIX: Changed to namespace import for react-router-dom to work around potential module resolution issues where named exports are not found.
import * as ReactRouterDOM from 'react-router-dom';
import { useProfile } from '../auth/useProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-50">
        <p className="text-brand-700 text-lg">Carregando...</p>
      </div>
    );
  }

  if (!profile) {
    return <ReactRouterDOM.Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    return <ReactRouterDOM.Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
