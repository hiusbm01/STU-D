import React from 'react';
import { Link as RouterLink, useNavigate} from 'react-router-dom';
import useUserStore from '../store/userStore';
import logoImage from '../assets/akilogo.png';
import { AppBar, Toolbar, Button, Box} from '@mui/material';
import { toast } from 'react-toastify';

function Header() {
    const {isLoggedIn, logout,role } = useUserStore();
    const navigate = useNavigate();
    
    const handleLogout = () =>{
        logout();
        toast.success('로그아웃 되었습니다.');
        navigate('/login');
    };
    
    return (
        <AppBar position="static" sx={{ backgroundColor: 'white' }} elevation={1}>
            <Toolbar>
                <RouterLink to ="/">
                    <Box component="img"
                         src={logoImage}
                         alt="StudyCafe로고"
                         sx={{ height: 40, display: 'block'}}
                    />
                </RouterLink>
                    <Box sx={{ marginLeft: 4}}>
                        <Button component={RouterLink} to="/" sx={{color: 'black'}}>Home</Button>
                        <Button component={RouterLink} to="/seats" sx={{color: 'black'}}>Seats</Button>
                        <Button component={RouterLink} to="/tickets" sx={{color: 'black'}}>Tickets</Button>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1}}/>

                    <Box>
                        {isLoggedIn ? (
                            <>
                                {role === "ROLE_ADMIN" && (
                                    <Button component={RouterLink} to="/admin" sx={{ color: 'black'}}>관리자</Button>
                                )}
                                <Button variant="outlined" onClick={handleLogout} sx={{ color: 'black'}}>로그아웃</Button>
                            </>
                        ) : (
                            <>
                                <Button component={RouterLink} to="/login" sx={{color: 'black'}}>로그인</Button>
                            </>
                        )}
                    </Box>
            </Toolbar>
        </AppBar>
    
    );
}

export default Header;