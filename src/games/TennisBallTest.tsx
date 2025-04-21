import React, { useEffect, useState, useRef } from 'react';

const TRIALS = 5;
const MAX_LIGHT_TIME = 1000; // ms

const TennisBallTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [trial, setTrial] = useState(0);
  const [falling, setFalling] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trial < TRIALS) {
      const delay = Math.random() * 3000 + 2000;
      timeoutRef.current = setTimeout(() => {
        setFalling(true);
        setStartTime(Date.now());
      }, delay);
    } else {
      const totalTime = times.reduce((a, b) => a + b, 0);
      const hits = times.length;
      const total = hits + misses;
      const accuracy = total > 0 ? hits / total : 1;
      const avgTime = hits > 0 ? totalTime / hits : MAX_LIGHT_TIME;
      const score = (accuracy * 65) + (35 * (1 - Math.min(avgTime, MAX_LIGHT_TIME) / MAX_LIGHT_TIME));

      onComplete(Math.round(score));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trial]);

  const handleClick = () => {
    if (falling && startTime) {
      const reactionTime = Date.now() - startTime;
      setTimes((prev) => [...prev, reactionTime]);
      setFalling(false);
      setStartTime(null);
      setTrial((prev) => prev + 1);
    } else if (!falling && trial < TRIALS) {
      setMisses((m) => m + 1);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Tennis Ball Catch</h2>
      <p style={{ fontSize: '18px', marginBottom: '8px' }}>
        Trial {Math.min(trial + 1, TRIALS)} of {TRIALS}
      </p>
      <div
        onClick={handleClick}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'green',
          borderRadius: '50%',
          margin: '0 auto',
          transform: falling ? 'translateY(200px)' : 'translateY(0)',
          transition: 'transform 0.7s ease',
          cursor: 'pointer',
        }}
      />
      <p style={{ marginTop: '20px' }}>Click the ball as it falls!</p>
    </div>
  );
};

export default TennisBallTest;
