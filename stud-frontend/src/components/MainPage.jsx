import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import useUserStore from '../store/userStore';
import apiClient from '../api/api';
import {toast} from 'react-toastify';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import './MainPage.css';
import Swal from 'sweetalert2';

function MainPage(){
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [activeSeat,setActiveSeat] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const[openCheckoutConfirm, setOpenCheckoutConfirm] = useState(false);
    const [recentHistory, setRecentHistory] = useState(null);

    const fetchActiveSeat = async () =>{
        try{
            const activeSeatPromise = apiClient.get('/seats/my-seat');
            const dashboardPromise = apiClient.get('/seats/dashboard');
            const historyPromise = apiClient.get('/seats/history/recent');

            const [
                activeSeatResponse,
                dashboardResponse,
                historyResponse] = await Promise.all([activeSeatPromise, dashboardPromise,historyPromise]);
            setActiveSeat(activeSeatResponse.data);
            setDashboardData(dashboardResponse.data);
            setRecentHistory(historyResponse.data);
        }catch(error) {
            if(error.response && error.response.status !== 204){
                console.error('Failed to fetch active seat:', error);
            }else{
                setActiveSeat(null);
            }
        }
    };

    useEffect(() =>{
        fetchActiveSeat();
    },[]);

    // 퇴실 처리
    const handleConfirmCheckout = async () => {
        setOpenCheckoutConfirm(false);
        try{
            const response = await apiClient.post('/seats/checkout');
            const checkoutInfo = response.data;

            Swal.fire({
                icon: 'success',
                title: '퇴실 처리 완료',
                html: `
                    <div>총 이용 시간 : <strong>${checkoutInfo.durationMinutes}분</strong></div>
                    <hr>
                    <div><strong>[남은 이용권 정보]</strong></div>
                    <div>${checkoutInfo.updatedUserTicket.ticketName}</div>
                    <div>${checkoutInfo.remainingBalanceMessage}</div>
                    `,
            });
            fetchActiveSeat();
        }catch(error){
            console.error('Failed to checkout:', error);
            toast.error(error.response?.data || '퇴실 처리에 실패했습니다.');
        }
    };
    

    return(
        <div className ="main-container">
            
          

            {recentHistory && (
                <div className="usage-status-card">
                    <div className="usage-status-header">
                        <span>이용현황</span>
                        <span>{new Date(recentHistory.checkOutTime).toLocaleString('ko-KR')}[퇴실]</span>
                    </div>
                    <div className="usage-status-body">
                        최근에 {recentHistory.seatNumber} 좌석을 {recentHistory.durationMinutes }분 이용했습니다.
                    </div>
                </div>
            )}

            {dashboardData && (
                <div className = "dashboard">
                    <div className= "dashboard-item">
                        <span className="dashboard-label">개인석</span>
                        <span className="dashboard-value">{dashboardData.availableSeats} / {dashboardData.totalSeats}</span>
                    </div>
                    <div className="dashboard-item">
                        <span className="dashboard-label">스터디룸</span>
                        <span className="dashboard-value">0 / 2</span>
                    </div>
                </div>
            )}
            
            <div className="main-menu">
                {activeSeat ? (
                    <button onClick={() => navigate('/seats')}>자리 이동</button>  
                ): (
                    <button onClick={() => navigate('/seats')}>좌석 예약</button>
                )}
                {activeSeat && (
                    <button className ="checkout-btn" onClick={() => setOpenCheckoutConfirm(true)}>퇴실하기</button>
                )}
                <button onClick={() => navigate('/tickets')}>이용권 구매</button>
                <button onClick={() => navigate('/mypage')}>마이페이지</button>
            </div>
            
            <Dialog open={openCheckoutConfirm} onClose={() => setOpenCheckoutConfirm(false)}>

                <DialogTitle>퇴실 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말 퇴실하시겠습니까? 사용 중인 좌석이 반납됩니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCheckoutConfirm(false)}>취소</Button>
                    <Button onClick={handleConfirmCheckout} color="error" autoFocus>
                        퇴실
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MainPage;