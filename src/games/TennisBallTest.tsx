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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
    fontFamily: 'sans-serif',
  },
  ballsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: '400px',
    height: '250px',
    marginTop: '40px',
    position: 'relative' as const,
  },
  ballStyle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#00e676',
    position: 'absolute' as const,
    top: 0,
    cursor: 'pointer',
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
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
      }, delay);
    } else if (phase === 'playing' && trial >= TRIALS) {
      const hits = times.length;
      const accuracy = hits / (hits + misses || 1);
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
    if (phase !== 'playing' || fallingIndex === null) return;
    if (index === fallingIndex && startTime) {
      const reactionTime = Date.now() - startTime;
      setTimes(prev => [...prev, reactionTime]);
    } else {
      setMisses(m => m + 1);
    }
    setFallingIndex(null);
    setStartTime(null);
    setTrial(prev => prev + 1);
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
    return [0, 1].map(index => {
      const isFalling = index === fallingIndex;
      return (
        <motion.div
          key={index}
          style={{
            ...styles.ballStyle,
            left: index === 0 ? '20%' : '70%',
            backgroundColor: index === 0 ? '#00e676' : '#2196f3',
          }}
          initial={isFalling ? { opacity: 0, scale: 0.8, y: 0 } : false}
          animate={isFalling ? { opacity: 1, scale: 1, y: 200 } : {}}
          transition={isFalling ? { duration: 0.5, ease: 'easeInOut' } : {}}
          onClick={() => handleBallClick(index)}
        />
      );
    });
  };

  const renderContent = () => {
    switch (phase) {
      case 'ready':
        return (
          <>
            <h2>Tennis Ball Catch</h2>
            <p>Click the ball that falls. You have {TRIALS} tries!</p>
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
            <p>Trial {trial + 1} of {TRIALS}</p>
            <div style={styles.ballsRow}>{renderBalls()}</div>
            <p>Click the falling ball!</p>
          </>
        );
      case 'summary':
        const hits = times.length;
        const accuracy = hits / (hits + misses || 1);
        const avgTime = hits > 0 ? times.reduce((a, b) => a + b, 0) / hits : MAX_REACTION_TIME;
        return (
          <>
            <h2>🏁 Test Summary</h2>
            <p>🎯 Hits: {hits}</p>
            <p>❌ Misses: {misses}</p>
            <p>⏱️ Avg Reaction: {Math.round(avgTime)} ms</p>
            <p>📊 Accuracy: {(accuracy * 100).toFixed(1)}%</p>
            <h3>🔥 Score: {finalScore}</h3>
            <button style={styles.button} onClick={() => onComplete(finalScore || 0)}>Next</button>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      {renderContent()}
    </div>
  );
};

export default TennisBallTest;
