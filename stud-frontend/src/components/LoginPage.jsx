import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import useUserStore from '../store/userStore';

import { Button, TextField, Box, Typography, Container} from '@mui/material';

function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useUserStore();

    //로그인 버튼 클릭 시 실행될 함수
    const handleLoginSubmit = async (event) =>{
        event.preventDefault();

        try{
            const response = await axios.post('http://localhost:8080/api/users/login',{
                email: email,
                password: password,
            });
            const token = response.data.token;
            login({ email: email}, token);

            alert('로그인 성공!');
            console.log('받아온 토큰: ',token);

            navigate('/');
        } catch(error){
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            console.error('로그인 에러:', error);
        }
    };


    return(
      <Container component="main" maxWidth="xs">
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
                로그인
            </Typography>
            <Box component="form" onSubmit={handleLoginSubmit} sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="이메일 주소"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt:3, mb: 2}}
                
                >로그인
                </Button>
                <Typography variant ="body2" align="center">
                    아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
                </Typography>
            </Box>
        </Box>
      </Container>
    )
}

export default LoginPage;