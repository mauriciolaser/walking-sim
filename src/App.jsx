import React, { useState, useEffect } from 'react';
import HomeLogin from './components/HomeLogin/HomeLogin';
import Navbar from './components/Navbar/Navbar';
import HomeSetup from './components/HomeSetup/HomeSetup';
import HomeStatus from './components/HomeStatus/HomeStatus';
import HomePerfil from './components/HomePerfil/HomePerfil';

function App() {
  // Token de Google
  const [token, setToken] = useState(
    () => localStorage.getItem('googleCredential') || null
  );
  // Control de vistas
  const [showSetup, setShowSetup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // Journey persistido
  const [journey, setJourney] = useState(() => {
    const j = localStorage.getItem('journey');
    return j ? JSON.parse(j) : null;
  });

  // Persistir journey
  useEffect(() => {
    if (journey) {
      localStorage.setItem('journey', JSON.stringify(journey));
    }
  }, [journey]);

  // Login recibe solo el token
  const handleLogin = (accessToken) => {
    localStorage.setItem('googleCredential', accessToken);
    setToken(accessToken);
  };

  const handleSetup = () => {
    setShowProfile(false);
    setShowSetup(true);
  };
  const handleStatus = () => {
    setShowProfile(false);
    setShowSetup(false);
  };
  const handleProfile = () => {
    setShowSetup(false);
    setShowProfile(true);
  };

  const handleJourneySet = (data) => {
    setJourney(data);
    setShowSetup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('googleCredential');
    setToken(null);
    setShowProfile(false);
  };

  // Datos de usuario (reemplaza con tus valores o estados reales)
  const userFirstName = 'TuNombre';
  const userLastName  = 'TuApellido';

  return (
    <div className="appContainer">
      {!token ? (
        <HomeLogin onLogin={handleLogin} />
      ) : (
        <>
          <Navbar
            onSetup={handleSetup}
            onStatus={handleStatus}
            onProfile={handleProfile}
          />

          {showProfile ? (
            <HomePerfil
              firstName={userFirstName}
              lastName={userLastName}
              onLogout={handleLogout}
            />
          ) : showSetup ? (
            <HomeSetup onSave={handleJourneySet} />
          ) : (
            <HomeStatus token={token} journey={journey} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
