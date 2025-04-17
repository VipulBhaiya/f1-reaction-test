// LightsOutTest.tsx – No Tailwind
import React, { useEffect, useState, useRef } from 'react';

const TRIALS = 5;

const LightsOutTest = ({ onComplete }: { onComplete: (avgTime: number) => void }) => {
  const [trial, setTrial] = useState(0);
  const [waiting, setWaiting] = useState(true);
  const [ready, setReady] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trial < TRIALS) {
      const delay = Math.random() * 3000 + 2000;
      timeoutRef.current = setTimeout(() => {
        setReady(true);
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
    if (ready && startTime) {
      const reactionTime = Date.now() - startTime;
      setTimes((prev) => [...prev, reactionTime]);
      setReady(false);
      setStartTime(null);
      setTrial((prev) => prev + 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '300px',
        backgroundColor: ready ? 'green' : 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}
    >
      Lights Out Reaction - Click when green!
    </div>
  );
};

export default LightsOutTest;