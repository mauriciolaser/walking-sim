import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import HomeLogin from './components/HomeLogin/HomeLogin.jsx';

function App() {
  // Control básico de autenticación
  const token = localStorage.getItem('googleCredential');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!token ? <HomeLogin onLogin={(t) => {
            localStorage.setItem('googleCredential', t);
            window.location.href = '/';
          }} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
