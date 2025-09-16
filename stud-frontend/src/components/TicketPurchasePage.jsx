import React, { useState, useEffect} from 'react';
import apiClient from '../api/api';
import useUserStore from '../store/userStore';
import {useNavigate} from 'react-router-dom';

import {Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress} from '@mui/material';
import Swal from 'sweetalert2';


function TicketPurchasePage() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const {token, isHydrated} = useUserStore();
    const navigate = useNavigate();

   useEffect(() => {
        const fetchTickets = async () => {
            if(!isHydrated || !token) return;
            
            try{
                const response = await apiClient.get('/tickets');
                setTickets(response.data);
            }catch( error){
                console.error('티켓 조회에 실패', error);
                Swal.fire('오류', '이용권 정보를 불러오는 데 실패했습니다.', 'error');
            }
        };
        fetchTickets();
   }, [token, isHydrated]);

   const handlePurchase = async(ticketId) =>{
        if (!ticketId){
            Swal.fire('이용권 선택', '먼저 구매할 이용권을 선택해주세요.', 'warning');
            return;
        }
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

        if(!result.isConfirmed) return;

        let isSuccess = false;
        try{
            await apiClient.post(`/tickets/${ticketId}/purchase`, {});
            isSuccess = true;
        } catch (error){
            console.error('Failed to purchase ticket:', error.response);
            const errorMessage = error.response?.data?.message || '이용권 구매 중 오류가 발생했습니다';
            await Swal.fire('구매 실패', errorMessage, 'error');
        }

        if(isSuccess) {
            await Swal.fire('구매 완료', '이용권 구매가 완료되었습니다.', 'success');
            navigate('/');
        }
   };

   if(!isHydrated || tickets.length === 0){
        return (
            <Box sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
                <CircularProgress />
            </Box>
        );
   }

   return (
        <Container maxWidth="md" sx={{ py: 8}}>
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight:'bold'}}>
                Choose Your Pass
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb:6}}>
                Select the perfect ticket type for your study needs from our flexible options.
            </Typography>
        

            <Grid container spacing={4}>
                {tickets.map((ticket) =>(
                    <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                        <Card onClick={() => setSelectedTicketId(ticket.id)}
                            sx={{
                                cursor: 'pointer',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: ticket.id === selectedTicketId ? '2px solid' : '1px solid',
                                borderColor: ticket.id=== selectedTicketId ? 'primary.main' : 'grey.200',
                                transform: ticket.id === selectedTicketId ? 'scale(1.03)' : 'none',
                                transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out',
                                '&:hover' : {
                                    boxShadow:6,
                                }
                            }}
                        >
                            <CardContent sx= {{ flexGrow: 1, textAlign: 'center'}}>
                                <Typography variant = "h5" component="h2" gutterBottom sx={{ fontWeight: 'bold'}}>
                                    {ticket.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    {ticket.type === 'PERIOD' && `${ticket.durationDays}일 기간권`}
                                    {ticket.type === 'FIXED' && `${ticket.durationHours}시간 정액권(유효기간 ${ticket.durationDays}일)`}
                                    {ticket.type === 'HOURLY' && `${ticket.durationHours}시간`}
                                </Typography>
                                <Typography variant="h4" component="p" sx={{ my:2 , fontWeight: 'bold'}}>
                                    {ticket.price.toLocaleString()}원
                                </Typography>
                            </CardContent>
                            <CardActions sx= {{ justifyContent: 'center', p: 2}}>

                                <Button fullWidth
                                        size="large"
                                        variant={ticket.id === selectedTicketId ? "contained": "outlined"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePurchase(ticket.id);
                                        }}
                                >
                                    구매하기
                                </Button>
                            </CardActions>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Container>
   );
}

export default TicketPurchasePage;