import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import useUserStore from '../store/userStore';
import './Header.css';
import logoImage from '../assets/akilogo.png';

function Header() {
    const {isLoggedIn, logout } =useUserStore();
    const navigate = useNavigate();
    
    const handleLogout = () =>{
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/login');
    };
    
    return (
        <header className="header">
            <Link to="/" className="header-logo">
                <img src={logoImage} alt="StudyCafe로고"/>
            </Link>
            <nav className="header-nav">
                {isLoggedIn ?(    
                    <button onClick={handleLogout}>로그아웃</button> 
                ) : (null)}
            </nav>
        </header>
    );
}

export default Header;