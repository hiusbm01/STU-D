import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { toast } from 'react-toastify'; // ✨ 1. toast를 다시 import 합니다.
import Swal from 'sweetalert2';
import './SeatSelectionPage.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

// 남은 시간을 계산하는 함수
const calculateRemainingTime = (endTimeString) => {
    if (!endTimeString) return '';
    const now = new Date();
    const endTime = new Date(endTimeString);
    const diffMs = endTime - now;

    if (diffMs > 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}시간 ${diffMinutes}분 남음`;
    } else {
        return '만료됨';
    }
};

function SeatSelectionPage() {
    const [seats, setSeats] = useState([]);
    const [activeSeat, setActiveSeat] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const navigate = useNavigate();

    const fetchSeatData = useCallback(async () => {
        try {
            
            const seatsPromise = apiClient.get('/seats');
            const activeSeatPromise = apiClient.get('/seats/my-seat');
            const [seatsResponse, activeSeatResponse] = await Promise.all([seatsPromise, activeSeatPromise]);

            console.log("서버에서 받은 좌석 데이터", seatsResponse.data);
            setSeats(seatsResponse.data);
            setActiveSeat(activeSeatResponse.data);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Failed to fetch seats:', error);
            }
        }
    }, []);

    useEffect(() => {
        fetchSeatData();
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            onConnect: () => {
                stompClient.subscribe('/topic/seats', (message) => {
                    setSeats(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => console.error('STOMP Error:', frame),
        });
        stompClient.activate();
        return () => stompClient.deactivate();
    }, [fetchSeatData]);

    const handleSeatClick = (seat) => {

        if (activeSeat && activeSeat.id === seat.id) {
            toast.info('현재 사용하고 계신 좌석입니다.');
            return;
        }

        if (seat.status !== 'AVAILABLE') {
            toast.warn('이미 사용 중인 좌석입니다.'); 
            return;
        }

        
        setSelectedSeat(seat);
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        if (!selectedSeat) return;
        const isChangingSeat = !!activeSeat;
        const apiUrl = isChangingSeat ? `/seats/${selectedSeat.id}/change` : `/seats/${selectedSeat.id}/reserve`;

        try {
            await apiClient.post(apiUrl, {});
            handleCloseConfirm();

            if (isChangingSeat) {
                Swal.fire('자리 이동 완료!', `'${activeSeat.seatNumber}'번에서 '${selectedSeat.seatNumber}'번으로 이동했습니다.`, 'success');
                fetchSeatData();
            } else {
                Swal.fire('입실 완료!', `'${selectedSeat.seatNumber}'번 좌석에 입실했습니다.`, 'success')
                    .then(() => navigate('/'));
            }
        } catch (error) {
            handleCloseConfirm();
            console.error('API call failed:', error);
            const errorMessage = error.response?.data?.message || '요청 처리 중 오류가 발생했습니다.';
            if (!isChangingSeat && error.response?.status === 402) {
                Swal.fire('이용권이 없습니다', '이용권을 먼저 구매해주세요.', 'info')
                    .then(() => navigate('/tickets'));
            } else {
                Swal.fire('요청 실패', errorMessage, 'error');
            }
        }
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedSeat(null);
    };

    return (
        <div>
            <h1>좌석 선택</h1>
            <div className="seat-grid-container">
                {seats.map((s) => (
                    <div key={s.id} className={`seat ${s.status.toLowerCase()}`} onClick={() => handleSeatClick(s)}>
                        <h3>{s.seatNumber}</h3>
                        <p>
                            {s.status === 'AVAILABLE' ? '사용 가능' : calculateRemainingTime(s.endTime)}
                        </p>
                    </div>
                ))}
            </div>

            <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                <DialogTitle>{activeSeat ? '자리 이동 확인' : '좌석 예약 확인'}</DialogTitle>
                <DialogContent>
                    {selectedSeat && (activeSeat ? `'${activeSeat.seatNumber}'번에서 '${selectedSeat.seatNumber}'번으로 이동하시겠습니까?`
                        : `'${selectedSeat.seatNumber}'번 좌석을 예약하시겠습니까?`
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>취소</Button>
                    <Button onClick={handleConfirm} autoFocus>{activeSeat ? '이동' : '예약'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SeatSelectionPage;