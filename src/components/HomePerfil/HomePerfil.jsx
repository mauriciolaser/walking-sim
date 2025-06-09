import React from 'react';
import styles from './HomePerfil.module.scss';

function HomePerfil({ firstName, lastName, onLogout }) {
  return (
    <div className={styles.profileContainer}>
      <h2>Perfil</h2>
      <p><strong>Nombre:</strong> {firstName}</p>
      <p><strong>Apellido:</strong> {lastName}</p>
      <button className={styles.logoutButton} onClick={onLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default HomePerfil;
