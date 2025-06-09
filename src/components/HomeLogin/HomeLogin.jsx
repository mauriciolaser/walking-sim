import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './HomeLogin.module.scss';

function HomeLogin({ onLogin }) {
  const login = useGoogleLogin({
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/fitness.activity.read',
    onSuccess: (tokenResponse) => {
      // tokenResponse.access_token es el access token válido
      onLogin(tokenResponse.access_token);
    },
    onError: () => {
      console.error('Error al obtener access token');
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Iniciar sesión</h2>
        <button
          onClick={() => login()}
          className={styles.googleButton}
        >
          Iniciar con Google
        </button>
      </div>
    </div>
  );
}

export default HomeLogin;
