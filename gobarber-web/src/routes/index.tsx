import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import RoutesAuth from './RoutesAuth';
import RoutesPrivate from './RoutesPrivate';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Switch>
      <Route element={<RoutesAuth isSignin={!!user} />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<RoutesPrivate isSignin={!!user} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Switch>
  );
};

export default Routes;
