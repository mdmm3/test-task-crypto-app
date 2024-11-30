import React from 'react';
import { Navigate } from 'react-router-dom';

import useAuthStore from '@/services/authStore';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute= ({ children }: Props) => {
  const isAuthorized = useAuthStore(state => state.isAuthorized);

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;