// import React, { useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   useEffect(()=>{
//     console.log("Is Auth", isAuthenticated)
//   },[isAuthenticated])
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }else if(isAuthenticated){
//     return <Navigate to="/dashboard" replace />;
//   }

//   // return <>{children}</>;
// };

// export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    // You can replace this with a loading spinner or any other loading indicator
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;