import React, { use, useContext } from 'react'
import { AuthContext } from './context/AuthProvider';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {
    const {isLoggedIn}=useContext(AuthContext);
  return isLoggedIn ? (
    <Navigate to="/dashboard" />
  ) : (
    children
  )
}

export default PublicRoute