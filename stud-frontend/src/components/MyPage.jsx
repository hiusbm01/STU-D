import React, { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import apiClient from '../api/api';
import './MyPage.css';
import { Button } from '@mui/material';

function MyPage() {
    const [myTickets, setMyTickets] = useState([]);
    const [usageHistory, setUsageHistory] = useState([]);
    const [activeSeat, setActiveSeat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

   
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const ticketsPromise = apiClient.get('/tickets/my');
            const historyPromise = apiClient.get('/seats/history');
            const seatPromise = apiClient.get('/seats/my-seat');
            
            const [ticketsResponse, historyResponse, seatResponse] = await Promise.all([ticketsPromise, historyPromise, seatPromise]);
            
            setMyTickets(ticketsResponse.data);
            setUsageHistory(historyResponse.data);
            setActiveSeat(seatResponse.data); 
        
        } catch (error) {
            if (error.response && error.response.status !== 204) {
                 console.error('마이페이지 데이터 로딩 실패:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckout = async () => {
        if (!window.confirm("정말 퇴실하시겠습니까? 사용중인 좌석이 반납됩니다.")) {
            return;
        }
        try {
            await apiClient.post('/seats/checkout');
            alert('퇴실 처리되었습니다.');
            fetchData(); 
        } catch (error) {
            console.error('Failed to checkout:', error);
            alert(error.response?.data || '퇴실 처리에 실패했습니다.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR');
    }

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="mypage-container">
            <h1>마이페이지</h1>
            <h2>내 이용권</h2>
            <ul className="ticket-list">
                {myTickets.length > 0 ? (
                    myTickets.filter(ticket => ticket.status === 'ACTIVE').map((ticket) => (
                        <li key={ticket.id} className="ticket-item">
                            <div className="ticket-info">
                                <h3>{ticket.ticketName}</h3>
                                <p>구매일: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                                {ticket.expiryDate && (
                                    <p>만료일: {new Date(ticket.expiryDate).toLocaleDateString()}</p>
                                )}
                                {ticket.remainingTime != null && (
                                    <p>남은 시간: {Math.floor(ticket.remainingTime / 60)}시간 {ticket.remainingTime % 60}분</p>
                                )}
                            </div>
                            <div className="ticket-actions">
                                <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                                    {ticket.status}
                                </span>
                                {/* activeSeat 정보가 있을 때만 퇴실 버튼을 보여줍니다. */}
                                {activeSeat && ticket.status === 'ACTIVE' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={handleCheckout}
                                        style={{ marginLeft: '10px' }}
                                    >퇴실하기</Button>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>보유한 이용권이 없습니다.</p>
                )}
            </ul>

            <h2 className="history-title">최근 이용 기록</h2>
            <ul className="ticket-list">
                {usageHistory.length > 0 ? (
                    usageHistory.map((history) => (
                        <li key={history.id} className="ticket-item">
                            <div className="ticket-info">
                                <h3>{history.seatNumber} 좌석</h3>
                                <p>입실: {formatDate(history.checkInTime)}</p>
                                <p>퇴실: {formatDate(history.checkOutTime)}</p>
                                <p>이용 시간: {history.durationMinutes}분</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>최근 이용 기록이 없습니다.</p>
                )}
            </ul>
        </div>
    );
}

export default MyPage;