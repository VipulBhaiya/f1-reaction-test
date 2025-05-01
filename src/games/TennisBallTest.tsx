import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import F1StartLights from '../components/F1StartLights';

// SFX imports
import catchSound from '../assets/sfx/hit.mp3';
import missSound from '../assets/sfx/miss.mp3';
import fallingSound from '../assets/sfx/falling.mp3';

const TRIALS = 5;
const MAX_REACTION_TIME = 1000;

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    position: 'relative' as const,
    textAlign: 'center' as const,
    boxSizing: 'border-box' as const,
    padding: '0 20px',
  },  
  ballsRow: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '400px',
    height: '400px',
    marginTop: '40px',
  },
  ballStyle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: 0,
    zIndex: 2,
    boxShadow: '0 0 25px 8px rgba(225, 6, 0, 0.6)',
    transition: 'transform 0.2s ease',
  },
  hitbox: {
    position: 'relative' as const,
    width: '60px',
    height: '260px',
    cursor: 'pointer',
    zIndex: 4,
  },
  hand: {
    width: '50px',
    height: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '20px 20px 0 0',
    position: 'absolute' as const,
    top: '-25px',
    left: '0',
    zIndex: 3,
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
  },
  floor: {
    position: 'absolute' as const,
    bottom: 0,
    height: '40px',
    width: '100%',
    backgroundColor: '#222',
    borderTop: '4px solid #e10600',
    zIndex: 1,
  },
  button: {
    padding: '14px 28px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    backgroundColor: '#e10600',
    border: '2px solid #e10600',
    color: '#ffffff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '24px',
  },
};


const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play().catch((e) => console.error('Sound playback failed', e));
};

const TennisBallTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'summary'>('ready');
  const [trial, setTrial] = useState(0);
  const [fallingIndex, setFallingIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
  const [ballKey, setBallKey] = useState(0);
  const [isTrialResolved, setIsTrialResolved] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallingAudioRef = useRef<HTMLAudioElement | null>(null);

  const playFallingSound = () => {
    if (fallingAudioRef.current) {
      fallingAudioRef.current.pause();
      fallingAudioRef.current.currentTime = 0;
    }
    fallingAudioRef.current = new Audio(fallingSound);
    fallingAudioRef.current.play().catch((e) => console.error('Sound playback failed', e));
  };

  const stopFallingSound = () => {
    if (fallingAudioRef.current) {
      fallingAudioRef.current.pause();
      fallingAudioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (phase === 'playing' && trial < TRIALS) {
      const delay = Math.random() * 3000 + 1000;
      timeoutRef.current = setTimeout(() => {
        const randomBall = Math.floor(Math.random() * 2);
        setFallingIndex(randomBall);
        setStartTime(Date.now());
        setBallKey((k) => k + 1);
        setIsTrialResolved(false);

        playFallingSound();
      }, delay);
    } else if (phase === 'playing' && trial >= TRIALS) {
      const hits = times.length;
      const accuracy = hits / TRIALS;
      const avgTime = hits > 0 ? times.reduce((a, b) => a + b, 0) / hits : MAX_REACTION_TIME;
      const score = (accuracy * 60) + (40 * (1 - Math.min(avgTime, MAX_REACTION_TIME) / MAX_REACTION_TIME));
      setFinalScore(Math.round(score));
      setPhase('summary');
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trial, phase]);

  const handleBallClick = (index: number) => {
    if (phase !== 'playing' || isTrialResolved) return;

    stopFallingSound();

    if (index === fallingIndex && startTime !== null) {
      playSound(catchSound);
      const reactionTime = Date.now() - startTime;
      setTimes((prev) => [...prev, reactionTime]);
      setFlashColor('green');
    } else {
      playSound(missSound);
      setMisses((m) => m + 1);
      setFlashColor('red');
    }

    setIsTrialResolved(true);
    setTimeout(() => setFlashColor(null), 300);
    setFallingIndex(null);
    setStartTime(null);
    setTrial((prev) => prev + 1);
  };

  const handleMiss = () => {
    if (isTrialResolved || fallingIndex === null) return;

    stopFallingSound();

    setIsTrialResolved(true);
    setFlashColor('red');
    playSound(missSound);
    setTimeout(() => {
      setMisses((m) => m + 1);
      setFallingIndex(null);
      setStartTime(null);
      setTrial((prev) => prev + 1);
      setTimeout(() => setFlashColor(null), 300);
    }, 200);
  };

  const startTest = () => {
    setTrial(0);
    setTimes([]);
    setMisses(0);
    setFallingIndex(null);
    setFinalScore(null);
    setPhase('countdown');
  };

  const renderBalls = () => {
    return [0, 1].map((index) => {
      const isFalling = index === fallingIndex;
      const xPosition = index === 0 ? '20%' : '70%';

      return (
        <div key={index} style={{ position: 'absolute', left: xPosition, top: 0 }}>
          {isFalling && (
            <div
              onClick={() => handleBallClick(index)}
              style={styles.hitbox}
            >
              <motion.div
                key={ballKey}
                initial={{ y: 0, scaleX: 1, scaleY: 1 }}
                animate={{
                  y: 360,
                  scaleX: isTrialResolved ? [1, 1.3, 1] : 1,
                  scaleY: isTrialResolved ? [1, 0.5, 1] : 1,
                }}
                transition={{
                  y: { duration: 1.2, ease: 'easeIn' },
                  scaleX: { duration: 0.3, ease: 'easeOut' },
                  scaleY: { duration: 0.3, ease: 'easeOut' },
                }}
                onAnimationComplete={handleMiss}
                style={{
                  ...styles.ballStyle,
                  backgroundColor: index === 0 ? '#00e676' : '#2196f3',
                }}
              />
            </div>
          )}
          {isFalling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: 5 }}
              transition={{ duration: 0.3 }}
              style={{
                ...styles.hand,
                backgroundColor: index === 0 ? '#fff' : '#ddd',
              }}
            />
          )}
        </div>
      );
    });
  };

  const renderContent = () => {
    switch (phase) {
      case 'ready':
        return (
          <>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 300,
              color: '#e10600',
              textShadow: '0 0 10px #e10600',
              marginBottom: '16px',
            }}>
              🎾 Tennis Ball Reflex Test
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#bbbbbb',
              maxWidth: '500px',
              marginBottom: '32px',
            }}>
              Click the falling ball as quickly and accurately as you can.
              There are {TRIALS} trials — stay focused!
            </p>
            <button
              style={styles.button}
              onClick={startTest}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Start
            </button>
          </>
        );
  
      case 'countdown':
        return (
          <>
            <h2 style={{
              fontSize: '2rem',
              color: '#ffffff',
              marginBottom: '20px',
            }}>
              🎬 Get Ready...
            </h2>
            <F1StartLights onComplete={() => setPhase('playing')} />
          </>
        );
  
      case 'playing':
        return (
          <>
            <h2 style={{ fontSize: '1.8rem', color: '#e10600', marginBottom: '16px' }}>
              Trial {trial + 1} of {TRIALS}
            </h2>
            <div style={styles.ballsRow}>
              {renderBalls()}
              <div style={styles.floor} />
            </div>
          </>
        );
  
      case 'summary':
        const hits = times.length;
        const accuracy = hits / TRIALS;
        const avgTime = hits > 0 ? times.reduce((a, b) => a + b, 0) / hits : MAX_REACTION_TIME;
  
        return (
          <>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#e10600',
              textShadow: '0 0 8px #e10600',
              marginBottom: '20px',
            }}>
              🏁 Test Complete!
            </h1>
  
            <div style={{
              marginTop: '12px',
              backgroundColor: '#1a1a1a',
              padding: '20px 30px',
              borderRadius: '12px',
              boxShadow: '0 0 12px rgba(225, 6, 0, 0.5)',
              width: '300px',
              textAlign: 'left',
              fontSize: '1.1rem',
            }}>
              <p>✅ Hits: <strong>{hits}</strong></p>
              <p>❌ Misses: <strong>{misses}</strong></p>
              <p>⏱️ Avg Reaction: <strong>{Math.round(avgTime)} ms</strong></p>
              <p>🎯 Accuracy: <strong>{(accuracy * 100).toFixed(1)}%</strong></p>
              <p>🔥 Score: <strong>{finalScore}</strong></p>
            </div>
  
            <button
              style={{ ...styles.button, marginTop: '32px', width: '220px' }}
              onClick={() => onComplete(finalScore || 0)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Continue
            </button>
          </>
        );
    }
  };  

  return (
    <motion.div
      style={{
        ...styles.container,
        backgroundColor:
          flashColor === 'green'
            ? '#2e7d32'
            : flashColor === 'red'
            ? '#b71c1c'
            : 'transparent',
        transition: 'background-color 0.3s ease',
      }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default TennisBallTest;