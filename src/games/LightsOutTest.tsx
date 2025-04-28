import React, { useEffect, useRef, useState } from 'react';
import F1StartLights from '../components/F1StartLights';

const TRIALS = 5;
const MAX_LIGHT_TIME = 1000;

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
    fontFamily: 'sans-serif',
    textAlign: 'center' as const,
  },
  box: {
    width: '80%',
    maxWidth: '400px',
    height: '200px',
    borderRadius: '16px',
    backgroundColor: '#444',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    userSelect: 'none' as const,
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#ffc107',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

type Phase = 'start' | 'countdown' | 'waiting' | 'ready' | 'tooEarly' | 'summary';

const LightsOutTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [phase, setPhase] = useState<Phase>('start');
  const [trial, setTrial] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase === 'waiting') {
      const delay = Math.random() * 3000 + 2000;
      timeoutRef.current = setTimeout(() => {
        setPhase('ready');
        setStartTime(Date.now());
      }, delay);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  const handleClick = () => {
    if (phase === 'ready' && startTime) {
      const reactionTime = Date.now() - startTime;
      setReactionTimes((prev) => [...prev, reactionTime]);
      setHits((h) => h + 1);
      setStartTime(null);
      if (trial + 1 >= TRIALS) {
        setPhase('summary');
      } else {
        setTrial((t) => t + 1);
        setPhase('waiting');
      }
    } else if (phase === 'waiting') {
      setMisses((m) => m + 1);
      navigator.vibrate?.(200);
      setPhase('tooEarly');
      setTimeout(() => {
        if (trial + 1 >= TRIALS) {
          setPhase('summary');
        } else {
          setTrial((t) => t + 1);
          setPhase('waiting');
        }
      }, 1000);
    }
  };

  const startTest = () => {
    setTrial(0);
    setHits(0);
    setMisses(0);
    setReactionTimes([]);
    setPhase('countdown');
  };

  const totalTime = reactionTimes.reduce((a, b) => a + b, 0);
  const avgTimePerLight = hits > 0 ? totalTime / hits : MAX_LIGHT_TIME;
  const accuracy = hits / (hits + misses || 1);
  const score =
    (accuracy * 65) +
    (35 * (1 - Math.min(avgTimePerLight, MAX_LIGHT_TIME) / MAX_LIGHT_TIME));

  useEffect(() => {
    if (phase === 'summary') {
      onComplete(Math.round(score));
    }
  }, [phase]);

  const renderContent = () => {
    const showTrial = ['waiting', 'ready', 'tooEarly'].includes(phase);

    switch (phase) {
      case 'start':
        return (
          <>
            <h2>Lights Out Reaction Test</h2>
            <p>Click when the screen turns green. Don’t click too early!</p>
            <button style={styles.button} onClick={startTest}>
              Ready
            </button>
          </>
        );
      case 'countdown':
        return (
          <>
            <h2>🎬 Get Ready...</h2>
            <F1StartLights onComplete={() => setPhase('waiting')} />
          </>
        );
      case 'waiting':
      case 'ready':
      case 'tooEarly':
        return (
          <>
            {showTrial && (
              <p style={{ fontSize: '1rem', marginBottom: 8 }}>
                Trial {trial + 1} of {TRIALS}
              </p>
            )}
            <div
              style={{
                ...styles.box,
                backgroundColor:
                  phase === 'waiting'
                    ? '#555'
                    : phase === 'ready'
                    ? 'green'
                    : 'red',
              }}
            >
              {phase === 'waiting'
                ? 'Wait for it...'
                : phase === 'ready'
                ? 'Click!'
                : 'Too early!'}
            </div>
          </>
        );
      case 'summary':
        return (
          <>
            <h2>🏁 Test Summary</h2>
            <p>✅ Hits: {hits}</p>
            <p>❌ Misses: {misses}</p>
            <p>⏱️ Avg Reaction: {Math.round(avgTimePerLight)} ms</p>
            <p>🎯 Accuracy: {(accuracy * 100).toFixed(1)}%</p>
            <h3>🔥 Score: {Math.round(score)}</h3>
            <button style={styles.button} onClick={() => setPhase('start')}>
              Restart
            </button>
          </>
        );
    }
  };

  return (
    <div style={styles.container} onClick={handleClick}>
      {renderContent()}
    </div>
  );
};

export default LightsOutTest;
