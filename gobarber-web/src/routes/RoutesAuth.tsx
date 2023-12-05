import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoutesAuthProps {
  isSignin: boolean;
}

const RoutesAuth: React.FC<RoutesAuthProps> = ({ isSignin }) => {
  return !isSignin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default RoutesAuth;
