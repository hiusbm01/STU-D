import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Typography} from '@mui/material';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import {seatData} from '../data/seatData';
import SeatMap from './SeatMap';



function SeatSelectionPage() {
    const [seats, setSeats] = useState([]);
    const [activeSeat, setActiveSeat] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const navigate = useNavigate();

    const fetchSeatData = useCallback(async () => {
        try {
            
            const seatsResponse = await apiClient.get('/seats');
            const activeSeatResponse = await apiClient.get('/seats/my-seat');

            const liveSeats = seatsResponse.data;
            const mergedSeats = seatData.map(layoutSeat => {
                if(layoutSeat.type === 'seat'){
                    const liveSeat = liveSeats.find(s => s.seatNumber === layoutSeat.seatNumber);
                    return liveSeat ? {...layoutSeat, ... liveSeat} : layoutSeat;
                }
                return layoutSeat;
            })
            setSeats(mergedSeats);
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
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                stompClient.subscribe('/topic/seats', (message) => {
                  const liveSeats = JSON.parse(message.body);
                  const mergedSeats = seatData.map(layoutSeat => {
                    if(layoutSeat.type === 'seat'){
                        const liveSeat = liveSeats.find(s => s.seatNumber === layoutSeat.seatNumber);
                        return liveSeat ? {...layoutSeat, ...liveSeat} : layoutSeat;
                    }
                    return layoutSeat;
                  });
                  setSeats(mergedSeats);
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
        <Box sx={{ p: 4}}>
            <Typography variant="h4" component="h1" align="center" asx={{ fontWeight:'bold', mb:4}}>
                좌석 선택
            </Typography>
            
            <SeatMap seats={seats}
                     activeSeatId={activeSeat?.id}
                     selectedSeatId={selectedSeat?.id}
                     onSeatClick={handleSeatClick}
            />

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
        </Box>
    );
}

export default SeatSelectionPage;