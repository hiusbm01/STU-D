import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useUserStore from '../store/userStore';
import './SeatSelectionPage.css';

function SeatSelectionPage() {
    const [seats, seaSeats] = useState([]);
    const token = useUserStore((store) => state.token);

    //컴포넌트 로드 -> 좌석데이터가져옴
    useEffect(() =>{
        const fetchSeats = async () =>{
            try{
                const response = await axios.get('/api/seats', {
                    headers: { 'Authorization' : `Bearer ${token}` }
                });
                seaSeats(response.data);
            } catch (error){
                console.error( '좌석을 불러오는 데 실패했습니다.',error);
            }
        };
        fetchSeats();
    }, [token]);

    return (
        <div>
            <h1>좌석 선택</h1>
            <div className ="seat-grid-container">
                {seats.map((seat)=>(
                    <div key={seat.id} className={`seat ${seat.status.toLowerCase()}`}>
                        <h3>{seat.seatNumbers}</h3>
                        <p>{seat.status === 'AVAILABLE' ? '사용 가능' : '사용 중'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default SeatSelectionPage;