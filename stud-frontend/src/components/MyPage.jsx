import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';


import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button, CircularProgress, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Swal from 'sweetalert2';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString.replace('T', ' ')).toLocaleString('ko-KR');
};

const formatDuration = (minutes) => {
    if (minutes === null || minutes === undefined) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}시간 ` : ''}${mins}분`;
};

function MyPage() {
    const [myTickets, setMyTickets] = useState([]);
    const [usageHistory, setUsageHistory] = useState([]);
    const [activeSeat, setActiveSeat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const ticketsPromise = apiClient.get('/tickets/my');
            const historyPromise = apiClient.get('/seats/history');
            const seatPromise = apiClient.get('/seats/my-seat').catch(error => {
                
                if (error.response?.status === 404 || error.response?.status === 204) {
                    return null;
                }

                throw error;
            });
            
            const [ticketsResponse, historyResponse, seatResponse] = await Promise.all([ticketsPromise, historyPromise, seatPromise]);
            
            setMyTickets(ticketsResponse.data);
            setUsageHistory(historyResponse.data);

           
            if (seatResponse && seatResponse.data) {
                setActiveSeat(seatResponse.data);
            } else {
                setActiveSeat(null);
            }
        
        } catch (error) {
            console.error('마이페이지 데이터 로딩 실패:', error);
            Swal.fire('오류', '마이페이지 정보를 불러오는 데 실패했습니다.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', fontFamily: "'Lora', serif" }}>
                마이페이지
            </Typography>

            {activeSeat && (
                <Card sx={{ mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                        <Box>
                            <Typography>현재 이용중인 좌석</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activeSeat.seatNumber}번</Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontFamily: "'Lora', serif", mt: activeSeat ? 2 : 0 }}>
                내 이용권
            </Typography>

            <Grid container spacing={2}>
                {myTickets.length > 0 ? myTickets.map((ticket) => (
                    <Grid item xs={12} key={ticket.userTicketId}>
                        <Card variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{ticket.ticketName}</Typography>
                                    <Chip label={ticket.status === 'ACTIVE' ? '사용가능' : '만료됨'} color={ticket.status === 'ACTIVE' ? 'success' : 'default'} />
                                </Box>
                                <Divider sx={{ my: 1.5 }}/>
                                <Typography variant="body2" color="text.secondary">구매일: {formatDate(ticket.purchaseDate)}</Typography>
                                <Typography variant="body2" color="text.secondary">만료일: {formatDate(ticket.expiryDate)}</Typography>
                                {ticket.remainingTime != null && (
                                     <Typography variant="body2" color="text.secondary">남은 시간: {formatDuration(ticket.remainingTime)}</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item xs={12}><Typography align="center" color="text.secondary" sx={{ py: 5 }}>보유한 이용권이 없습니다.</Typography></Grid>
                )}
            </Grid>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontFamily: "'Lora', serif", mt: 6, borderTop: '1px solid #ddd', pt: 4 }}>
                최근 이용 기록
            </Typography>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>좌석 번호</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>입실 시간</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>퇴실 시간</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">이용 시간</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usageHistory.length > 0 ? usageHistory.map((history) => (
                                <TableRow key={history.id}>
                                    <TableCell>{history.seatNumber}번</TableCell>
                                    <TableCell>{formatDate(history.checkInTime)}</TableCell>
                                    <TableCell>{formatDate(history.checkOutTime)}</TableCell>
                                    <TableCell align="right">{formatDuration(history.durationMinutes)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">최근 이용 기록이 없습니다.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}

export default MyPage;