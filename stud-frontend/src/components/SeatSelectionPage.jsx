import React, {useState, useEffect, useCallback} from 'react';
import apiClient from '../api/api';
import useUserStore from '../store/userStore';
import './SeatSelectionPage.css';

function SeatSelectionPage(){
     const [seats, setSeats] = useState([]);
     const user = useUserStore((state) => state.user);
    //  const {token, user} ==> 리액트 무한루프.. 이유?

    const fetchSeats = useCallback(async () => {
        try{
            const response= await apiClient.get('/seats');
            setSeats(response.data);
        } catch(error){
            console.error('Failed to fetch seats:', error);
        }
    }, [user])
    
    useEffect(() => {
        fetchSeats();
    }, [fetchSeats]);

    const handleSeatClick = async(seat) =>{
        if(seat.status !== 'AVAILABLE'){
            alert('이미 사용중인 좌석입니다.');
            return;
        }

        if(!window.confirm(`'${seat.seatNumber}' 좌석을 예약하시겠습니까?`)){
            return;
        }

        try{
            await apiClient.post(`/seats/${seat.id}/reserve`);
            alert (`${seat.seatNumber} 좌석에 입실했습니다.`);
            fetchSeats();    
        } catch(error) {
        console.error('Failed to reserve seat:', error);
        alert(error.response?.data || '좌석 예약에 실패했습니다.');
        }
    };

    return (
        <div>
            <h1>좌석 선택</h1>
            <div className="seat-grid-container">
                {seats.map((s) =>{
                    let remainingTime = '';
                    if(s.status === 'OCCUPIED' && s.endTime){
                        const now = new Date();
                        const endTime = new Date(s.endTime);
                        const diffMs = endTime - now;
                   
                        if(diffMs>0){
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffMinutes = Math.floor(diffMs % (1000 * 60 * 60) / (1000*60))
                            remainingTime = `${diffHours}시간 ${diffMinutes}분 남음`;
                        }
                        else {
                            remainingTime = '만료됨';
                        }
                    }
                    return (
                        <div key={s.id} className={`seat ${s.status.toLowerCase()}`}
                        onClick={() => handleSeatClick(s)}
                        >
                            <h3>{s.seatNumber}</h3>
                            <p>{s.status === 'AVAILABLE' ? '사용 가능' : remainingTime}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    )

}

export default SeatSelectionPage;