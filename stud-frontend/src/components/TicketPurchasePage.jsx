import React, {useState,useEffect} from 'react';
import apiClient from '../api/api'
import useUserStore from '../store/userStore';
import {useNavigate} from 'react-router-dom';
import './TicketPurchasePage.css';
import {Button} from '@mui/material';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';


function TicketPurchasePage() {
    const [tickets, setTickets] = useState([]);
    const token = useUserStore((state) => state.token);
    const isHydrated = useUserStore((state) => state.isHydrated);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () =>{
            if( !isHydrated || !token) return;

            try{
                const response = await apiClient.get('/tickets');
                setTickets(response.data);
            } catch(error){
                console.error("티켓 조회에 실패:", error);
            }
        };
        fetchTickets();
    },[token,isHydrated]);

    const handlePurchase = async (ticketId) =>{
        const result = await Swal.fire({
            title: '구매하시겠습니까?',
            text: "결제 후에는 이용권이 바로 활성화됩니다.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '구매',
            cancelButtonText: '취소',
       });

       if(!result.isConfirmed){
            return;
       }

       let isSuccess = false;

        try{
            await apiClient.post(`/tickets/${ticketId}/purchase`, {});
            isSuccess = true;
        
        }catch(error){
            console.error('Failed to purchase ticket:',error.response);
        const errorMessage = error.response?.data?.message || '이용권 구매 중 오류가 발생했습니다.';
        await Swal.fire({
                icon: 'error',
                title: '구매 실패',
                text: errorMessage
        });

        }
        if(isSuccess){

            await Swal.fire({
                icon: 'success',
                title: '구매 완료!',
                text: '이용권 구매가 완료되었습니다.'
            });
            
            navigate('/');
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