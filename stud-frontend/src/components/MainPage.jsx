import React from 'react';
import {useNavigate} from 'react-router-dom';
import useUserStore from '../store/userStore';
import './MainPage.css';

function MainPage(){
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    

    return(
        <div className ="main-container">
            <h1>환영합니다, {user?.name}님!</h1>
            <p>원하시는 서비스를 선택해주세요.</p>
            <div className="main-menu">
                <button onClick={() => navigate('/seats')}>좌석 예약</button>
                <button onClick={() => navigate('/tickets')}>이용권 구매</button>
                <button onClick={() => navigate('/mypage')}>마이페이지</button>
            </div>
        </div>
    );
}

export default MainPage;