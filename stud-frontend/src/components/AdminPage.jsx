import React, {useState, useEffect} from 'react';
import apiClient from '../api/api';
import './AdminPage.css';

function AdminPage(){
    const [users, setUsers] = useState([]);
    const [allTickets, setAllTickets] = useState([]);

    useEffect(() =>{
        const fetchUsers = async() => {
            try{
                const userPromise = apiClient('/admin/users');
                const ticketsPromise = apiClient('/admin/tickets');

                const [usersResponse,ticketsRepsponse] = await Promise.all([userPromise, ticketsPromise]);
            
                setUsers(usersResponse.data);
                setAllTickets(ticketsRepsponse.data);

            } catch( error){
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);
    
    const formatDate = (dateString) => new Date(dateString).toLocaleString('ko-KR');

    return (
        <div className="admin-container">
            <h1>관리자 페이지</h1>
            <h2 className="table-title">전체 이용권 구매 목록</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>구매 ID</th>
                        <th>이용권 이름</th>
                        <th>구매자 이메일</th>
                        <th>구매일</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {allTickets.map(ticket =>(
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.ticketName}</td>
                            <td>{ticket.userEmail}</td>
                            <td>{formatDate(ticket.purchaseDate)}</td>
                            <td>{ticket.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="table-title">전체 사용자 목록</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>(
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


}

export default AdminPage;