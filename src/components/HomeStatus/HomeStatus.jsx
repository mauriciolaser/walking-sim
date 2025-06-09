import React, { useState, useEffect } from 'react';
import styles from './HomeStatus.module.scss';

function HomeStatus({ token, journey }) {
  const [steps, setSteps] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch(`/api/consultarpasos.php?token=${token}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setSteps(data.steps);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSteps();
  }, [token]);

  const stepToKm = (s) => s * 0.0008; // 0.8 m por paso

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Error cargando pasos: {error}</p>
      </div>
    );
  }

  if (steps === null) {
    return (
      <div className={styles.container}>
        <p>Cargando pasos…</p>
      </div>
    );
  }

  const walkedKm = stepToKm(steps);
  const percent = journey
    ? Math.min((walkedKm / journey.distance) * 100, 100)
    : 0;

  return (
    <div className={styles.container}>
      <h2>Estado Diario</h2>
      <p><strong>Pasos totales:</strong> {steps}</p>
      <p><strong>Distancia recorrida:</strong> {walkedKm.toFixed(2)} km</p>

      {journey && (
        <>
          <h3>Trayecto</h3>
          <p>De <em>{journey.origin}</em> a <em>{journey.destination}</em></p>
          <p>Distancia total: {journey.distance.toFixed(2)} km</p>

          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p>{percent.toFixed(1)}% completado</p>
        </>
      )}
    </div>
  );
}

export default HomeStatus;
