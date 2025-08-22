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

    const[openCheckoutConfirm, setOpenCheckoutConfirm] = useState(false);

    const fetchActiveSeat = async () =>{
        try{
            const response = await apiClient.get('/seats/my-seat');
            setActiveSeat(response.data);
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
                    <div>${checkoutInfo.reamainingBalanceMessage}</div>
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
            
            {activeSeat ? (
                <p>현재 '{activeSeat.seatNumber}'번 좌석을 이용중입니다.</p>
            ): (
                <p> 원하시는 서비스를 선택해주세요.</p>
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