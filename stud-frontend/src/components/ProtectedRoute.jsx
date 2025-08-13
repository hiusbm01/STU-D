import React from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

function ProtectedRoute({ children }) {
    const {isLoggedIn } = useUserStore();

    if(!isLoggedIn){
        return <Navigate to="/login" replace />;
    }

    return children;

}

export default ProtectedRoute;