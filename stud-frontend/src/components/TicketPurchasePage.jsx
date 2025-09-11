import React, {useState,useEffect} from 'react';
import axios from 'axios';
import useUserStore from '../store/userStore';
import './TicketPurchasePage.css';
import {Button} from '@mui/material';

function TicketPurchasePage() {
    const [tickets, setTickets] = useState([]);
    const token = useUserStore((state) => state.token);

    useEffect(() => {
        const fetchTickets = async () =>{
            if(!token) return;

            try{
                const response = await axios.get('/api/tickets',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTickets(response.data);
            } catch(error){
                console.error("티켓 구매에 실패:", error);
            }
        };
        fetchTickets();
    },[token]);

    const handlePurchase = async (ticketId) =>{
        if (!window.confirm("정말 이 이용권을 구매하시겠습니까?")){
            return;
        }
        try{
            await axios.post(`/api/tickets/${ticketId}/purchase`,{},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('이용권 구매가 완료되었습니다!');
            window.location.reload();

        }catch(error){
            console.error('Failed to purchase ticket:',error.response);
            if(error.response && error.response.data && error.response.data.message){
                alert(error.response.data.message);
            }else{
                alert('이용권 구매 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="ticket-purchase-container">
            <h1>이용권 구매</h1>
            <div className="ticket-grid">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                        <h3>{ticket.name}</h3>
                        {ticket.type === 'PERIOD' && <p>{ticket.durationDays}일 기간권</p>}
                        {ticket.type === 'FIXED' && <p>{ticket.durationHours}시간 정액권 (유효기간 {ticket.durationDays}일)</p>}
                        {ticket.type === 'HOURLY' && <p>{ticket.durationHours}시간</p>}
                        <p className="price">{ticket.price.toLocaleString()}원</p>
                        <Button variant="contained" onClick={() => handlePurchase(ticket.id)}>구매하기</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TicketPurchasePage;