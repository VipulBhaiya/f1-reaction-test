// TennisBallTest.tsx – No Tailwind
import React, { useEffect, useState, useRef } from 'react';

const TRIALS = 5;

const TennisBallTest = ({ onComplete }: { onComplete: (avgTime: number) => void }) => {
  const [trial, setTrial] = useState(0);
  const [falling, setFalling] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trial < TRIALS) {
      const delay = Math.random() * 3000 + 2000;
      timeoutRef.current = setTimeout(() => {
        setFalling(true);
        setStartTime(Date.now());
      }, delay);
    } else {
      const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      onComplete(avg);
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
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Tennis Ball Catch</h2>
      <div
        onClick={handleClick}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'green',
          borderRadius: '50%',
          margin: '0 auto',
          transform: falling ? 'translateY(200px)' : 'translateY(0)',
          transition: 'transform 0.7s ease'
        }}
      />
      <p style={{ marginTop: '20px' }}>Click the ball as it falls!</p>
    </div>
  );
};

export default TennisBallTest;