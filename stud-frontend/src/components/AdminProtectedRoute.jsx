import React from 'react';
import {Navigate} from 'react-router-dom';
import useUserStore from '../store/userStore';
import {toast} from 'react-toastify';

function AdminProtectedRoute({children}){
    const {isLoggedIn, role} = useUserStore();

    if(!isLoggedIn){
        return <Navigate to="/login" replace />;
    }

    if(role !== 'ROLE_ADMIN'){
        toast.error('관리자만 접근할 수 있는 페이지입니다.');
        return <Navigate to="/" replace />;
    }

    return children;
}


export default AdminProtectedRoute;