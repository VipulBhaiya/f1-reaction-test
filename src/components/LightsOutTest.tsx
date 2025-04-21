import React, { useEffect, useState, useRef } from 'react';

const TRIALS = 5;
const MAX_LIGHT_TIME = 1000; // in milliseconds

const LightsOutTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [trial, setTrial] = useState(0);
  const [ready, setReady] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trial < TRIALS) {
      const delay = Math.random() * 3000 + 2000;
      timeoutRef.current = setTimeout(() => {
        setReady(true);
        setStartTime(Date.now());
      }, delay);
    } else {
      // Calculate scoring
      const totalTime = reactionTimes.reduce((a, b) => a + b, 0);
      const accuracy = hits + misses > 0 ? hits / (hits + misses) : 1;
      const avgTimePerLight = hits > 0 ? totalTime / hits : MAX_LIGHT_TIME;
      const score =
        accuracy * 65 +
        35 * (1 - Math.min(avgTimePerLight, MAX_LIGHT_TIME) / MAX_LIGHT_TIME);

      onComplete(Math.round(score));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trial]);

  const handleClick = () => {
    if (ready && startTime) {
      const reactionTime = Date.now() - startTime;
      setReactionTimes((prev) => [...prev, reactionTime]);
      setHits((h) => h + 1);
      setReady(false);
      setStartTime(null);
      setTrial((prev) => prev + 1);
    } else if (!ready && trial < TRIALS) {
      // premature click
      setMisses((m) => m + 1);
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
        fontSize: '24px',
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      Lights Out Reaction - Click when green!
    </div>
  );
};

export default LightsOutTest;
