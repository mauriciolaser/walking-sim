import React, { useState } from 'react';
import styles from './HomeSetup.module.scss';

function HomeSetup({ onSave }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Geocodifica con Nominatim
  const geocode = async (city) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
    );
    const data = await res.json();
    if (!data.length) throw new Error(`No se encontró "${city}"`);
    return { lat: +data[0].lat, lon: +data[0].lon };
  };

  // Haversine
  const computeDistance = (c1, c2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(c2.lat - c1.lat);
    const dLon = toRad(c2.lon - c1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const orig = await geocode(origin);
      const dest = await geocode(destination);
      const distance = computeDistance(orig, dest);
      onSave({ origin, destination, distance });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Configurar Trayecto</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Ciudad de origen"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ciudad de destino"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Calculando…' : 'Guardar'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default HomeSetup;
