import { useEffect, useRef, useState } from 'react';
import F1StartLights from '../components/F1StartLights';

import goSfx from '../assets/Sfx/go.mp3';
import successSfx from '../assets/Sfx/hit.mp3';
import errorSfx from '../assets/Sfx/miss.mp3';

const TRIALS = 5;
const MAX_LIGHT_TIME = 1000;

const styles = {
  wrapper: {
    position: 'relative' as const,
    zIndex: 10,
    overflow: 'hidden',
    minHeight: '100dvh',
    width: '100vw',
    background: 'transparent',
  },
  container: {
    minHeight: '100dvh',
    width: '100vw',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
    textAlign: 'center' as const,
    overflow: 'hidden',
    gap: '16px',
    padding: '24px',
    boxSizing: 'border-box' as const,
    margin: 0,
    position: 'relative' as const,
    zIndex: 20,
  },
  box: {
    width: '300px',
    height: '160px',
    borderRadius: '20px',
    backgroundColor: '#444',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'all 0.3s ease',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
  },
  button: {
    padding: '14px 32px',
    fontSize: '1.2rem',
    borderRadius: '12px',
    backgroundColor: '#e10600',
    border: '2px solid #e10600',
    color: '#ffffff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '12px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 300,
    color: '#e10600',
    textShadow: '0 0 10px #e10600',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#bbbbbb',
    maxWidth: '480px',
    marginBottom: '16px',
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

  const goAudio = useRef(new Audio(goSfx));
  const successAudio = useRef(new Audio(successSfx));
  const errorAudio = useRef(new Audio(errorSfx));

  useEffect(() => {
    // Removed document.body.style mutations to avoid side effects
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 'waiting') {
      const delay = Math.random() * 3000 + 2000;
      const timeoutId = setTimeout(() => {
        setPhase('ready');
        setStartTime(Date.now());
      }, delay);
      timeoutRef.current = timeoutId;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'ready') goAudio.current.play();
  }, [phase]);

  const handleClick = () => {
    if (phase === 'ready' && startTime) {
      const reactionTime = Date.now() - startTime;
      setReactionTimes((prev) => [...prev, reactionTime]);
      setHits((h) => h + 1);
      successAudio.current.play();
      setStartTime(null);
      trial + 1 >= TRIALS ? setPhase('summary') : nextTrial();
    } else if (phase === 'waiting') {
      setMisses((m) => m + 1);
      navigator.vibrate?.(200);
      errorAudio.current.play();
      setPhase('tooEarly');
      setTimeout(() => (trial + 1 >= TRIALS ? setPhase('summary') : nextTrial()), 1000);
    }
  };

  const nextTrial = () => {
    setTrial((t) => t + 1);
    setPhase('waiting');
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
  const score = (accuracy * 65) + (35 * (1 - Math.min(avgTimePerLight, MAX_LIGHT_TIME) / MAX_LIGHT_TIME));

  const renderContent = () => {
    const showTrial = ['waiting', 'ready', 'tooEarly'].includes(phase);

    switch (phase) {
      case 'start':
        return (
          <>
            <h1 style={styles.title}>💡 Lights Out Reflex Test</h1>
            <p style={styles.subtitle}>
              Click when the box turns green. Don't click too early!
            </p>
            <button
              style={styles.button}
              onClick={startTest}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Ready
            </button>
          </>
        );

      case 'countdown':
        return (
          <>
            <h2>🎬 Get Ready...</h2>
            <F1StartLights key={trial} onComplete={() => {
              setPhase('waiting');
            }} />
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
                    ? '#333'
                    : phase === 'ready'
                      ? '#00c853'
                      : '#d50000',
                color: phase === 'waiting' ? '#fff' : '#000',
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
            <h1 style={styles.title}>🏁 Test Complete!</h1>
            <div
              style={{
                marginTop: '24px',
                backgroundColor: '#1a1a1a',
                padding: '20px 30px',
                borderRadius: '12px',
                boxShadow: '0 0 12px rgba(225, 6, 0, 0.5)',
                width: '300px',
                textAlign: 'left',
                fontSize: '1.1rem',
              }}
            >
              <p>✅ Hits: <strong>{hits}</strong></p>
              <p>❌ Misses: <strong>{misses}</strong></p>
              <p>⏱️ Avg Reaction: <strong>{Math.round(avgTimePerLight)} ms</strong></p>
              <p>🎯 Accuracy: <strong>{(accuracy * 100).toFixed(1)}%</strong></p>
              <p>🔥 Score: <strong>{Math.round(score)}</strong></p>
            </div>
            <button
              style={{ ...styles.button, marginTop: '32px', width: '220px' }}
              onClick={() => onComplete(Math.round(score))}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Next
            </button>
          </>
        );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.container}
        onClick={['waiting', 'ready', 'tooEarly'].includes(phase) ? handleClick : undefined}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default LightsOutTest;
