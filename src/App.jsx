import React, { Suspense, useEffect, useState } from 'react';
import './App.css'
import CircularProgress from '@mui/material/CircularProgress';
import { Route, Routes } from 'react-router-dom';
const ScrollToTopButton = React.lazy(() => import('./services/scrollBar/scrollBar.jsx'));
const ToastContainer = React.lazy(() => import('./services/toast/ToastCenterPopup.jsx'));
const MobileEntry = React.lazy(() => import('./components/auth/mobileEntry.jsx'));
const Home = React.lazy(() => import('./components/dashboard/home.jsx'));
const CustomerHistory = React.lazy(() => import('./components/dashboard/customer/customerHistory.jsx'));
const ProtectedRoute = React.lazy(() => import('./services/utils/protectedRoute.jsx'));
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    // Just in case token is set in other tabs or externally
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="App">
      <Suspense fallback={<div style={{
        display: "grid", justifyContent: "center", placeItems: "center", position: "absolute", left: "50%",
        top: "50%"
      }}><CircularProgress style={{ color: "#dc3545" }} /></div>}>

        <ToastContainer />
        <ScrollToTopButton />
        {
          token ? (
            <div className='app-container'>
              <Routes>
                <Route path="/" element={<ProtectedRoute> < Home /> </ProtectedRoute>} />
                <Route path="/customer/:id/history" element={<ProtectedRoute> < CustomerHistory /> </ProtectedRoute>} />
              </Routes>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<MobileEntry setToken={setToken} />} />
            </Routes>
          )
        }
      </Suspense>
    </div>
  )
}

export default App
