import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/api';
import { toast } from 'react-toastify';

import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';

function SignupPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');


    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || emailRegex.test(email)) {
            setEmailError('');
            return true;
        }
        setEmailError('올바른 이메일 형식이 아닙니다.');
        return false;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!password || passwordRegex.test(password)) {
            setPasswordError('');
            return true;
        }
        setPasswordError('8자 이상, 영문과 숫자를 포함해야 합니다.');
        return false;
    };
    

    useEffect(() => {
        if (password && passwordConfirm && password !== passwordConfirm) {
            setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
            setPasswordConfirmError('');
        }
    }, [password, passwordConfirm]);


    useEffect(() => {
        setIsEmailChecked(false);
    }, [email]);


    const handleEmailCheck = async () => {
        if (!validateEmail(email)) {
            toast.warn('올바른 이메일 형식을 먼저 입력해주세요.');
            return;
        }
        try {
            const response = await apiClient.get(`/users/check-email?email=${email}`);
            if (response.data.isAvailable) {
                toast.success('사용 가능한 이메일입니다.');
                setIsEmailChecked(true); 
            } else {
                toast.error('이미 사용 중인 이메일입니다.');
                setIsEmailChecked(false);
            }
        } catch (error) {
            toast.error('확인 중 오류가 발생했습니다.');
        }
    };

    const handleSignupSubmit = async (event) => {
        event.preventDefault();
        

        if (!validateEmail(email) || !validatePassword(password) || !!passwordConfirmError) {
            toast.error('입력 정보를 다시 확인해주세요.');
            return;
        }
        if (!isEmailChecked) {
            toast.error('이메일 중복 확인을 해주세요.');
            return;
        }


        try {
            await apiClient.post('/users/register', { name, email, password, phoneNumber });
            toast.success('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
            toast.error(errorMessage);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">회원가입</Typography>
                <Box component="form" onSubmit={handleSignupSubmit} sx={{ mt: 3 }}>
                    <TextField margin="normal" required fullWidth label="이름" value={name} onChange={(e) => setName(e.target.value)} />
                    

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <TextField
                            margin="normal" required fullWidth label="이메일 주소" value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            error={!!emailError || (isEmailChecked === false && email !== '')}
                            helperText={emailError || (isEmailChecked ? '✅ 사용 가능한 이메일입니다.' : '중복 확인이 필요합니다.')}
                        />
                        <Button variant="outlined" onClick={handleEmailCheck} sx={{ mt: 2, height: 56, whiteSpace: 'nowrap' }}>
                            중복 확인
                        </Button>
                    </Box>


                    <TextField
                        margin="normal" required fullWidth label="비밀번호" type="password" value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                        error={!!passwordError}
                        helperText={passwordError || "8자 이상, 영문과 숫자를 포함해주세요."}
                    />
                    <TextField
                        margin="normal" required fullWidth label="비밀번호 확인" type="password" value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        error={!!passwordConfirmError}
                        helperText={passwordConfirmError}
                    />
                    <TextField margin="normal" fullWidth label="전화번호" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        가입하기
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <RouterLink to="/login" variant="body2">
                                이미 계정이 있으신가요? 로그인
                            </RouterLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default SignupPage;