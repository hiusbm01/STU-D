import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import logoImage from '../assets/akilogo.png'; 


import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

function Header() {
    const { isLoggedIn, logout, role } = useUserStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('로그아웃 되었습니다.');
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'background.default' }} elevation={0}>
            <Toolbar sx={{ position: 'relative', height: 80, display: 'flex', alignItems: 'center' }}>     
                <RouterLink to="/">
                    <Box
                        component="img"
                        src={logoImage}
                        alt="StudyCafe 로고"
                        sx={{ height: 40, display: 'block' }} 
                    />
                </RouterLink>              
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <Button component={RouterLink} to="/" sx={{ color: 'text.primary' }}>Home</Button>
                    <Button component={RouterLink} to="/seats" sx={{ color: 'text.primary' }}>Seats</Button>
                    <Button component={RouterLink} to="/tickets" sx={{ color: 'text.primary' }}>Tickets</Button>
                </Box>

                <Box sx={{ flexGrow: 1 }} />
 
                <Box>
                    {isLoggedIn ? (
        
                        <>
                            {role === "ROLE_ADMIN" && (
                                <Button component={RouterLink} to="/admin" sx={{ color: 'text.primary' }}>
                                    관리자
                                </Button>
                            )}
                            <Button component={RouterLink} to="/mypage" sx={{ color: 'text.primary' }}>
                                마이페이지
                            </Button>
                            <Button variant="outlined" onClick={handleLogout} sx={{ marginLeft: 2 }}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                 
                        <>
                            <Button component={RouterLink} to="/login" sx={{ color: 'text.primary' }}>
                                로그인
                            </Button>
                            <Button component={RouterLink} to="/register" variant="contained" sx={{ marginLeft: 2 }}>
                                회원가입
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;