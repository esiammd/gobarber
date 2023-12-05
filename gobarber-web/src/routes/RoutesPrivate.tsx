import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoutesPrivateProps {
  isSignin: boolean;
}

const RoutesPrivate: React.FC<RoutesPrivateProps> = ({ isSignin }) => {
  return isSignin ? <Outlet /> : <Navigate to="/" />;
};

export default RoutesPrivate;
