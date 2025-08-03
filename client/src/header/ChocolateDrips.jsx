import React, { useEffect, useState } from 'react';
import './ChocolateDrips.css';

import cake1 from '/img/cakes/1.jpg';
import cake2 from '/img/cakes/2.jpg';
import cake3 from '/img/cakes/3.jpg';
import cake4 from '/img/cakes/4.jpg';

const cakes = [cake1, cake2, cake3, cake4];

export default function CakeRain() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDrops = Array.from({ length: 3 }).map(() => ({
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        image: cakes[Math.floor(Math.random() * cakes.length)],
      }));
      setDrops(prev => [...prev, ...newDrops]);

      // הסרת עוגות ישנות אחרי 3 שניות
      setTimeout(() => {
        setDrops(prev =>
          prev.filter(drop => !newDrops.find(d => d.id === drop.id))
        );
      }, 3000);
    }, 500); // כל חצי שנייה

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cake-rain-container">
      {drops.map(drop => (
        <img
          key={drop.id}
          src={drop.image}
          className="cake-drop"
          style={{ left: `${drop.left}%` }}
          alt="cake"
        />
      ))}
    </div>
  );
}
