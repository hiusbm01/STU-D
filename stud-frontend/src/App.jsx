import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './App.css';
import SeatSelectionPage from './components/SeatSelectionPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './components/SignupPage';

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
        </Routes>
      </main>
    </div>
  );
}

export default App;