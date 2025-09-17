import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import apiClient from '../api/api'; 
import './SignupPageBootstrap.css';
import { toast } from 'react-toastify'; 


function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (passwordConfirm) {
            if (password !== passwordConfirm) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
            else {
                setPasswordError('');
            }
        }
    }, [password, passwordConfirm]);

    const handleSignupSubmit = async (event) => {
        event.preventDefault();

        if (password !== passwordConfirm) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('올바른 이메일 형식이 아닙니다.');
            return;
        }

        try {

            await apiClient.post('/users/register', {
                name,
                email,
                password,
                phoneNumber,
            });
            toast.success('회원가입에 성공했습니다! 로그인페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {

            const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요';
            toast.error(errorMessage);
            console.error('회원가입 에러: ', error);
        }
    };


    return (
        <div className="form-signup-container">
            <main className="form-signup w-100 m-auto">
                <form onSubmit={handleSignupSubmit}>
                    <h1 className="h3 mb-3 fw-normal">회원가입</h1>

                    <div className="form-floating mb-2">
                        <input type="text" className="form-control" id="floatingName"
                            placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required
                        />
                        <label htmlFor="floatingName">이름</label>
                    </div>

                    <div className="form-floating mb-2">
                        <input type="email" className="form-control" id="floatingEmail"
                            placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                        />
                        <label htmlFor="floatingEmail">이메일 주소</label>
                    </div>

                    <div className="form-floating mb-2">

                        <input type="password" className="form-control" id="floatingPassword"
                            placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        />
                        <label htmlFor="floatingPassword">비밀번호</label>
                    </div>

                    <div className="form-floating mb-2">
                        <input type="password" className="form-control" id="floatingPasswordConfirm"
                            placeholder="Password Confirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required
                        />
                        <label htmlFor="floatingPasswordConfirm">비밀번호 확인</label>
                        {passwordError && <div className="text-danger mt-1" style={{ fontSize: '14px' }}>{passwordError}</div>}
                    </div>



                    <div className="form-floating mb-2">
    
                        <input type="tel" className="form-control" id="floatingPhone"
                            placeholder="010-1234-1234" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <label htmlFor="floatingPhone">전화번호</label>
                    </div>

                    <button className="btn btn-primary w-100 py-2 mt-3" type="submit">
                        가입하기
                    </button>
                    <p className="mt-3 mb-3 text-body-secondary text-center">
                        이미 계정이 있으신가요? <RouterLink to="/login">로그인</RouterLink>
                    </p>

                </form>
            </main>
        </div>
    );
}

export default SignupPage;