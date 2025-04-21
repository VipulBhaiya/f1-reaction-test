import React, { useState, useEffect } from 'react';

type Mode = 'Classic' | 'Speed' | 'Precision' | 'Sudden Death' | 'Acceleration';

type Props = {
  onComplete: (score: number) => void;
};

const BatakTest: React.FC<Props> = ({ onComplete }) => {
  const [mode, setMode] = useState<Mode>('Classic');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [showMissFlash, setShowMissFlash] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(1000);

  const totalTime = 30;
  const maxReactionTime = 2.5;
  const rows = 4;
  const cols = 4;

  const buttonSize = Math.min(window.innerWidth, window.innerHeight) / 7;

  const hitSound = new Audio('/sounds/hit.mp3');
  const missSound = new Audio('/sounds/miss.mp3');
  const countdownSound = new Audio('/sounds/countdown.mp3');

  const handleStart = () => {
    setHits(0);
    setMisses(0);
    setScore(0);
    setFlashSpeed(1000);
    setTimeLeft(totalTime);
    setShowSummary(false);
    setGameActive(false);
    setCountdown(3); // Start the countdown
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      countdownSound.play();
      const timer = setTimeout(() => setCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCountdown(null); // Hide countdown screen
      setGameActive(true); // Start the game
    }
  }, [countdown]);

  useEffect(() => {
    if (!gameActive) return;

    if (timeLeft === 0 || (mode === 'Sudden Death' && misses > 0)) {
      setGameActive(false);
      const totalAttempts = hits + misses;
      const accuracy = totalAttempts > 0 ? hits / totalAttempts : 1;
      const avgReaction = totalTime / (totalAttempts || 1);
      const rawScore = (accuracy * 70) + (30 * (1 - avgReaction / maxReactionTime));
      const finalScore = Math.max(0, Math.round(rawScore));
      setScore(finalScore);
      setShowSummary(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, hits, misses, mode]);

  useEffect(() => {
    if (!gameActive || mode === 'Precision') return;

    let intervalId: NodeJS.Timeout;

    if (mode === 'Acceleration') {
      intervalId = setInterval(() => {
        flashTarget();
        setFlashSpeed(prev => Math.max(300, prev - 30));
      }, flashSpeed);
    } else {
      const speedMap: Record<Mode, number> = {
        Classic: 1000,
        Speed: 500,
        Precision: 1000,
        'Sudden Death': 1000,
        Acceleration: flashSpeed,
      };
      intervalId = setInterval(flashTarget, speedMap[mode]);
    }

    return () => clearInterval(intervalId);
  }, [gameActive, mode, flashSpeed]);

  const flashTarget = () => {
    const newIndex = Math.floor(Math.random() * rows * cols);
    setTargetIndex(newIndex);
  };

  const triggerMissFlash = () => {
    setShowMissFlash(true);
    setTimeout(() => setShowMissFlash(false), 150);
  };

  const handleClick = (i: number) => {
    if (!gameActive) return;
    if (i === targetIndex) {
      hitSound.play();
      setHits(h => h + 1);
    } else {
      missSound.play();
      setMisses(m => m + 1);
      triggerMissFlash();
      if (mode === 'Sudden Death') {
        setTimeLeft(0); // end immediately
      }
    }
    setTargetIndex(null);
  };

  const handleMissClick = () => {
    if (!gameActive) return;
    missSound.play();
    setMisses(m => m + 1);
    triggerMissFlash();
    setTargetIndex(null);
    if (mode === 'Sudden Death') {
      setTimeLeft(0);
    }
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    onComplete(score);
  };

  // Start screen
  if (!gameActive && countdown === null && !showSummary) {
    return (
      <div style={styles.centeredScreen}>
        <h2>Pick a Mode</h2>
        <select value={mode} onChange={e => setMode(e.target.value as Mode)} style={styles.select}>
          <option value="Classic">Classic</option>
          <option value="Speed">Speed</option>
          <option value="Precision">Precision</option>
          <option value="Sudden Death">Sudden Death</option>
          <option value="Acceleration">Acceleration</option>
        </select>
        <button onClick={handleStart} style={styles.buttonClose}>Start</button>
      </div>
    );
  }

  // Countdown screen
  if (countdown !== null) {
    return (
      <div style={styles.centeredScreen}>
        <h2>Get ready...</h2>
        <h1>{countdown}</h1>
      </div>
    );
  }

  // Summary screen
  if (showSummary) {
    return (
      <div style={styles.centeredScreen}>
        <h2>🏁 Test Complete</h2>
        <p>✅ Hits: {hits}</p>
        <p>❌ Misses: {misses}</p>
        <p>🎯 Accuracy: {(hits / (hits + misses || 1) * 100).toFixed(1)}%</p>
        <p>🏆 Score: {score}</p>
        <button onClick={handleSummaryClose} style={styles.buttonClose}>Continue</button>
      </div>
    );
  }

  // Game screen
  return (
    <div style={styles.gameContainer}>
      {showMissFlash && <div style={styles.missFlash} />}
      <div style={styles.uiContainer}>
        <h2>⏱ Time Left: {timeLeft}s</h2>
        <h3>🎯 Hits: {hits} | ❌ Misses: {misses}</h3>
      </div>
      <div style={styles.gridWrapper} onClick={handleMissClick}>
        <div style={styles.grid}>
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(i);
              }}
              style={{
                ...styles.button,
                width: buttonSize,
                height: buttonSize,
                backgroundColor: i === targetIndex ? '#ffc107' : '#666',
                boxShadow: i === targetIndex ? '0 0 25px 8px rgba(255, 255, 0, 0.8)' : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  gameContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1c1c1c',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredScreen: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1c1c1c',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 12,
  },
  uiContainer: {
    position: 'absolute',
    top: '3%',
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
  },
  gridWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  grid: {
    display: 'grid',
    gridTemplateRows: 'repeat(4, 1fr)',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  button: {
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonClose: {
    marginTop: 20,
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#ffc107',
    cursor: 'pointer',
  },
  missFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    zIndex: 5,
    pointerEvents: 'none',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: 10,
  },
};

export default BatakTest;
