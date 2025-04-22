import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const TRIALS = 5;
const MAX_REACTION_TIME = 1000;

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#111',
    color: 'white',
    fontFamily: 'sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  ballsRow: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '400px',
    height: '400px',
    marginTop: '40px',
  },
  ballStyle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    position: 'absolute' as const,
    top: 0,
    zIndex: 2,
    cursor: 'pointer',
  },
  hand: {
    width: '40px',
    height: '20px',
    backgroundColor: '#fff',
    borderRadius: '20px 20px 0 0',
    position: 'absolute' as const,
    top: '-25px',
    left: '0',
    zIndex: 3,
  },
  floor: {
    position: 'absolute' as const,
    bottom: 0,
    height: '40px',
    width: '100%',
    backgroundColor: '#2e7d32',
    borderTop: '4px solid #fff',
    zIndex: 1,
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

const TennisBallTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'summary'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [trial, setTrial] = useState(0);
  const [fallingIndex, setFallingIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [flashColor, setFlashColor] = useState<'green' | 'red' | null>(null);
  const [ballKey, setBallKey] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTrialResolved, setIsTrialResolved] = useState(false);

  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('playing');
      }
    }
  }, [countdown, phase]);

  useEffect(() => {
    if (phase === 'playing' && trial < TRIALS) {
      const delay = Math.random() * 3000 + 1000;
      timeoutRef.current = setTimeout(() => {
        const randomBall = Math.floor(Math.random() * 2);
        setFallingIndex(randomBall);
        setStartTime(Date.now());
        setBallKey((k) => k + 1);
        setIsTrialResolved(false);
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

    if (index === fallingIndex && startTime !== null) {
      const reactionTime = Date.now() - startTime;
      setTimes((prev) => [...prev, reactionTime]);
      setFlashColor('green');
    } else {
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

    setIsTrialResolved(true);
    setFlashColor('red');
    setTimeout(() => {
      setMisses((m) => m + 1);
      setFallingIndex(null);
      setStartTime(null);
      setTrial((prev) => prev + 1);
      setTimeout(() => setFlashColor(null), 300);
    }, 200);
  };

  const startTest = () => {
    setCountdown(3);
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
              onClick={() => handleBallClick(index)}
            />
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
            <h2>Tennis Ball Catch</h2>
            <p>Click the falling ball as fast as you can.</p>
            <button style={styles.button} onClick={startTest}>Ready</button>
          </>
        );
      case 'countdown':
        return (
          <>
            <h2>🎬 Get Ready...</h2>
            <h1>{countdown}</h1>
          </>
        );
      case 'playing':
        return (
          <>
            <h2>Trial {trial + 1} of {TRIALS}</h2>
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
            <h2>🏁 Test Summary</h2>
            <p>🎯 Hits: {hits}</p>
            <p>❌ Misses: {misses}</p>
            <p>⏱ Avg Reaction: {Math.round(avgTime)}ms</p>
            <p>📊 Accuracy: {(accuracy * 100).toFixed(1)}%</p>
            <h3>🔥 Score: {finalScore}</h3>
            <button style={styles.button} onClick={() => onComplete(finalScore || 0)}>Next</button>
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
            : '#111',
        transition: 'background-color 0.3s ease',
      }}
    >
      {renderContent()}
    </motion.div>
  );
};

export default TennisBallTest;
