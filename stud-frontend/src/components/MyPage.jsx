import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useUserStore from '../store/userStore';
import './MyPage.css';
import { Button } from '@mui/material';

function MyPage(){
    const [myTickets, setMyTickets] = useState([]);
    const token = useUserStore((state) => state.token);

    useEffect(() => {
        const fetchMyTickets = async () =>{
            if(!token) return;
            try{
                //백엔드에 이용권 목록 요청
                const response = await axios.get('/api/tickets/my', {
                    headers: { 'Authorization' : `Bearer ${token}`}
                });
                setMyTickets(response.data);
            } catch(error){
                console.error('Failed to fetch my tickets:', error);
            }
        };
        fetchMyTickets();

    }, [token]);

    const handleCheckout = async () => {
        if(!window.confirm("정말 퇴실하겠습니까? 사용중인 좌석이 반납됩니다.")){
            return;
        }
        try{
            await axios.post(
                '/api/seats/checkout',
                {},
                {headers: {'Authorization': `Bearer ${token}`}}
            );
            alert ('퇴실 처리되었습니다.');
            fetchMyTickets();
            //퇴실 후 내 이용권 목록 다시 불러옴
        }catch(error){
            console.error('Failed to checkout:', error);
            alert(error.response?.data || '퇴실 처리에 실패했습니다.')
        }
    };



    return(
        <div className="mypage-container">
            <h1>마이페이지</h1>
            <h2>내 이용권</h2>
            <ul className="ticket-list">
                {myTickets.length>0 ?(
                    myTickets.map((ticket) =>(
                        <li key={ticket.id} className="ticket-item">
                            <div className="ticket-info">
                                <h3>{ticket.ticketName}</h3>
                                <p>구매일: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                                {ticket.expiryDate && (
                                    <p>만료일 : {new Date(ticket.expiryDate).toLocaleDateString()}</p>
                                )}
                                {ticket.remainingTime != null &&(
                                    <p>남은 시간:{Math.floor(ticket.remainingTime/60)}</p>
                                )}
                            </div>
                            <div className="ticket-actions">
                                <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                                    {ticket.status}
                                </span>
                                {ticket.status === 'ACTIVE' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={handleCheckout}
                                        style={{ marginLeft: '10px'}}
                                    >퇴실하기</Button>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>보유한 이용권이 없습니다.</p>
                )}
            </ul>
        </div>
    );

}

export default MyPage;