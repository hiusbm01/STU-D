import { Routes, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './App.css';

function App(){
  return (
    <Routes>
      <Route path="/" element={<MainPage />}/>
      <Route path="/login" element={<LoginPage />}/>
    </Routes>
  );
}

export default App;