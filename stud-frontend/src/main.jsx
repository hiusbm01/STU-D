import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

import { createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily : "'Noto Sans KR', sans-serif",
  }
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>

          <App />
        </ThemeProvider>
      </BrowserRouter>
  </React.StrictMode>,


)