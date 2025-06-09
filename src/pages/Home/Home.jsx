// src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import HomeLogin from '../../components/HomeLogin/HomeLogin.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import HomeSetup from '../../components/HomeSetup/HomeSetup.jsx';
import HomeStatus from '../../components/HomeStatus/HomeStatus.jsx';
import HomePerfil from '../../components/HomePerfil/HomePerfil.jsx';

export default function Home() {
  const navigate = useNavigate();

  // Token de Google
  const [token, setToken] = useState(
    () => localStorage.getItem('googleCredential') || null
  );

  // Estados para el perfil
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState(null);

  // Control de vistas
  const [showSetup, setShowSetup]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Journey persistido
  const [journey, setJourney] = useState(() => {
    const j = localStorage.getItem('journey');
    return j ? JSON.parse(j) : null;
  });

  // Persistir journey en localStorage
  useEffect(() => {
    if (journey) {
      localStorage.setItem('journey', JSON.stringify(journey));
    }
  }, [journey]);

  // Cuando cambias a la vista “Perfil”, lanza la petición
  useEffect(() => {
    if (token && showProfile) {
      setLoadingProfile(true);
      setErrorProfile(null);

      fetch(`/api/profile?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setErrorProfile(data.error);
            setProfile(null);
          } else {
            setProfile(data);
          }
        })
        .catch(err => {
          console.error('Error cargando perfil:', err);
          setErrorProfile('Error al cargar perfil');
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [token, showProfile]);

  // Handlers de navegación
  const handleLogin   = accessToken => {
    localStorage.setItem('googleCredential', accessToken);
    setToken(accessToken);
    navigate('/');
  };
  const handleSetup   = () => { setShowProfile(false); setShowSetup(true); };
  const handleStatus  = () => { setShowProfile(false); setShowSetup(false); };
  const handleProfile = () => { setShowSetup(false); setShowProfile(true); };
  const handleJourneySet = data => {
    setJourney(data);
    setShowSetup(false);
  };
  const handleLogout  = () => {
    localStorage.removeItem('googleCredential');
    setToken(null);
    setShowProfile(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.homeContainer}>
      {!token ? (
        <HomeLogin onLogin={handleLogin} />
      ) : (
        <>
          <Navbar
            onSetup={handleSetup}
            onStatus={handleStatus}
            onProfile={handleProfile}
          />
          <div className={styles.pageContent}>
            {showProfile ? (
              loadingProfile ? (
                <p className={styles.loading}>Cargando perfil…</p>
              ) : errorProfile ? (
                <p className={styles.error}>{errorProfile}</p>
              ) : (
                <HomePerfil
                  firstName={profile.firstName}
                  lastName={profile.lastName}
                  onLogout={handleLogout}
                />
              )
            ) : showSetup ? (
              <HomeSetup onSave={handleJourneySet} />
            ) : (
              <HomeStatus token={token} journey={journey} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
