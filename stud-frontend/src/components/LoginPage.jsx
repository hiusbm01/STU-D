import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import './LoginPage.css';

function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
        <div className="login-container">
            <h1>로그인</h1>
            <form className="login-form" onSubmit={handleLoginSubmit}>
                <input type="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <input type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">로그인</button>
            </form>
            <div className="signup-link">
                아직 회원이 아니신가요? <a href="#">회원가입</a>
            </div>
        </div>
    )
}

export default LoginPage;