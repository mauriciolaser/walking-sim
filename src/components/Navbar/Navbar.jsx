import React from 'react';
import styles from './Navbar.module.scss';

function Navbar({ onSetup, onStatus, onProfile }) {
  return (
    <nav className={styles.nav}>
      <h1>Walking Simulator</h1>
      <div className={styles.buttons}>
        <button onClick={onStatus}>Status</button>
        <button onClick={onSetup}>Setup</button>
        <button onClick={onProfile}>Perfil</button>
      </div>
    </nav>
  );
}

export default Navbar;
