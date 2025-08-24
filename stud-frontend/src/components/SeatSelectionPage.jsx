import React, {useState, useEffect, useCallback} from 'react';
import apiClient from '../api/api';
import useUserStore from '../store/userStore';
import './SeatSelectionPage.css';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';

import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';

const calculatedRemainingTime = (endTimeString) =>{
    if (!endTimeString) return '';

    const now = new Date();
    const endTime = new Date(endTimeString);
    const diffMs = endTime - now;

    if(diffMs>0){
        const diffHours = Math.floor(diffMs/(1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60)/ (1000 * 60));
        
        return `${diffHours}시간 ${diffMinutes}분 남음`;
    }else{
        return '만료됨';
    }
};


function SeatSelectionPage(){
     const [seats, setSeats] = useState([]);
     const [activeSeat, setActiveSeat] = useState(null);
     const [openConfirm, setOpenConfirm] = useState(false);
     const [selectedSeat, setSelectedSeat] = useState(null);
     const navigate = useNavigate;
    //  const {token, user} ==> 리액트 무한루프.. 이유?

    const fetchSeats = useCallback(async () => {
        try{
            const seatsPromise = apiClient.get('/seats');
            const activeSeatPromise = apiClient.get('/seats/my-seat');
            
            const [seatsResponse, activeSeatResponse] = await Promise.all([seatsPromise, activeSeatPromise]);

            setSeats(seatsResponse.data);
            setActiveSeat(activeSeatResponse.data);
        } catch(error){
            console.error('Failed to fetch seats:', error);
        }
    }, [])
    
    useEffect(() => {
        const fetchInitialSeats = async () => {
            try{
                const response = await apiClient.get('/seats');
                setSeats(response.data);
            }catch(error){
                console.error('초기 좌석 정보를 불러오는데 실패했습니다', error);
            }
        };
        fetchInitialSeats();


        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

            onConnect: () => {
                console.log('웹소켓 연결 완료');

                stompClient.subscribe('/topic/seats', (message) => {
                    const receivedSeats = JSON.parse(message.body);
                    setSeats(receivedSeats);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP에러 :', error);
            },
        });
        stompClient.activate();

        return () => {
            stompClient.deactivate();
            console.log('웹소켓 연결 해제');
        }
    }, []);

    //좌석 클릭 핸들러
    const handleSeatClick = (seat) => {
        if(activeSeat && activeSeat.id === seat.id){
            toast.info('현재 사용중인 좌석입니다.');
            return;
        }
        if(seat.status !== 'AVAILABLE'){
            toast.warn('이미 사용중인 좌석입니다.',{position: "top-center"});
            return;
        }
        setSelectedSeat(seat);
        setOpenConfirm(true);
    }
    
    const handleConfirm = async () =>{
        if(!selectedSeat) return;

        //activeSeat 유무에 따라 다른 API호출
        const isChangingSeat = !!activeSeat;
        const apiUrl = isChangingSeat
        ? `/seats/${selectedSeat.id}/change`
        : `/seats/${selectedSeat.id}/reserve`;
        const successMessage = isChangingSeat ? '자리 이동에 성공했습니다.' : `'${selectedSeat.seatNumber}' 좌석에 입실했습니다.`;
    
        try{
            await apiClient.post(apiUrl);
            toast.success(successMessage);
            fetchSeats();
        } catch(error){
            console.error('API call failed:', error);

            if(!isChangingSeat && error.response && error.response.status === 402){
                toast.info('사용 가능한 이용권이 없습니다. 이용권을 먼저 구매해주세요.');
                navigate('/tickets');
            }
            else{
                toast.error(error.response?.data || '요청에 실패했습니다.', {position: "top-center"});
            }

        }finally{
            handleCloseConfirm();
        }
    
    
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedSeat(null);
    }


   return (
    <div>
        <h1>좌석 선택</h1>
        <div className = "seat-grid-container">
            {seats.map((s) => (
                <div key={s.id} className = {`seat ${s.status.toLowerCase()}`} onClick={() => handleSeatClick(s)}>
                    <h3>{s.seatNumber}</h3>
                    <p>
                        {s.status === 'AVAILABLE' ? '사용 가능' : calculatedRemainingTime(s.endTime)}
                    </p>
                </div>
            ))}
        </div>

        <Dialog open ={openConfirm} onClose={handleCloseConfirm}>
            <DialogTitle>좌석 예약 확인</DialogTitle>
            <DialogContent>
               {selectedSeat && (activeSeat ? `'${activeSeat.seatNumber}'에서 '${selectedSeat.seatNumber}'(으)로 이동하시겠습니까?`
                : `'${selectedSeat.seatNumber}'좌석을 예약하시겠습니까?`
               )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirm}>취소</Button>
                <Button onClick={handleConfirm} autoFocus>{activeSeat ? '이동': '예약'}</Button>
            </DialogActions>
        </Dialog>
    </div>
   )
}

export default SeatSelectionPage;