import { useState, useEffect } from 'react';

export default function Home() {
  const [dailyStory, setDailyStory] = useState('Loading...');
  const [transportData, setTransportData] = useState([]);
  const [transportError, setTransportError] = useState(null);

  useEffect(() => {
    fetch('/api/dailyStory')
      .then(res => res.json())
      .then(data => setDailyStory(data.story))
      .catch(err => setDailyStory('Error fetching daily story.'));

    fetch('/api/transport')
      .then(res => res.json())
      .then(data => {
         if(data.error) {
           setTransportError(data.error);
         } else {
           setTransportData(data.stationboard || []);
         }
      })
      .catch(err => setTransportError('Error fetching transport data.'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>witelli20</h1>
      <h2>Witellikerstrasse 20, Balgrist WG, Zurich</h2>
      <section>
        <h3>Daily Story</h3>
        <p>{dailyStory}</p>
      </section>
      <section>
        <h3>Live Transport from Balgrist Station</h3>
        {transportError ? (
          <p>{transportError}</p>
        ) : (
          <>
            {transportData.length > 0 ? (
              <ul>
                {transportData.map((item, index) => (
                  <li key={index} style={{ marginBottom: '1rem' }}>
                    <strong>{item.name || 'Unnamed Service'}</strong> to {item.to || 'Unknown Destination'}
                    {item.stop && item.stop.departure && <span> (Departure: {item.stop.departure})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading transport data...</p>
            )}
          </>
        )}
      </section>
    </div>
  );
} 