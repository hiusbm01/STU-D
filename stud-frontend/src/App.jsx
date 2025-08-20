import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './App.css';
import SeatSelectionPage from './components/SeatSelectionPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './components/SignupPage';
import TicketPurchasePage from './components/TicketPurchasePage';
import MyPage from './components/MyPage';

function App(){
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/"
            element={
            <ProtectedRoute>
                <MainPage />
            </ProtectedRoute>
            }
          />
          <Route path="/seats" element={<ProtectedRoute><SeatSelectionPage/></ProtectedRoute>}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>}/>
          <Route path="/tickets" element={<ProtectedRoute><TicketPurchasePage/></ProtectedRoute>}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;