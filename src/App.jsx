import React, { useState, useEffect } from 'react';
import HomeLogin from './components/HomeLogin/HomeLogin';
import Navbar from './components/Navbar/Navbar';
import HomeSetup from './components/HomeSetup/HomeSetup';
import HomeStatus from './components/HomeStatus/HomeStatus';

function App() {
  // Cargamos el access token de Google (o null)
  const [token, setToken] = useState(() =>
    localStorage.getItem('googleCredential') || null
  );
  // Controla si mostramos Setup o Status
  const [showSetup, setShowSetup] = useState(false);
  // Trayecto guardado
  const [journey, setJourney] = useState(() => {
    const j = localStorage.getItem('journey');
    return j ? JSON.parse(j) : null;
  });

  // Persistimos el journey
  useEffect(() => {
    if (journey) {
      localStorage.setItem('journey', JSON.stringify(journey));
    }
  }, [journey]);

  // Cuando recibimos el token, lo guardamos
  const handleLogin = (accessToken) => {
    localStorage.setItem('googleCredential', accessToken);
    setToken(accessToken);
  };

  const handleSetup = () => setShowSetup(true);
  const handleStatus = () => setShowSetup(false);

  // Recibe { origin, destination, distance }
  const handleJourneySet = (data) => {
    setJourney(data);
    setShowSetup(false);
  };

  return (
    <div className="appContainer">
      {!token ? (
        <HomeLogin onLogin={handleLogin} />
      ) : (
        <>
          <Navbar onSetup={handleSetup} onStatus={handleStatus} />
          {showSetup
            ? <HomeSetup onSave={handleJourneySet} />
            : <HomeStatus token={token} journey={journey} />
          }
        </>
      )}
    </div>
  );
}

export default App;
