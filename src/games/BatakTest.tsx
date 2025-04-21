import React, { useState, useEffect } from 'react';

type Mode = 'Classic' | 'Speed' | 'Precision' | 'Sudden Death' | 'Acceleration';

type Props = {
  onComplete: (score: number) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    gap: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: '16px',
    zIndex: 1,
  },
  circleButton: {
    borderRadius: '50%',
    backgroundColor: '#555',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  active: {
    backgroundColor: '#ffc107',
    boxShadow: '0 0 25px 8px rgba(255, 255, 0, 0.7)',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#ffc107',
    cursor: 'pointer',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: 10,
    backgroundColor: '#222',
    color: 'white',
    border: '1px solid #555',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    zIndex: 5,
    pointerEvents: 'none',
  },
  header: {
    marginBottom: 12,
  },
};

const BatakTest: React.FC<Props> = ({ onComplete }) => {
  const [mode, setMode] = useState<Mode>('Classic');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [showMissFlash, setShowMissFlash] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(1000);

  const totalTime = 15;
  const maxReactionTime = 2.5;
  const rows = 4;
  const cols = 4;

  const buttonSize = Math.min(window.innerWidth, window.innerHeight) / 7;

  const handleStart = () => {
    setHits(0);
    setMisses(0);
    setScore(0);
    setFlashSpeed(1000);
    setTimeLeft(totalTime);
    setShowSummary(false);
    setGameActive(false);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setGameActive(true);
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

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, hits, misses, mode]);

  useEffect(() => {
    if (!gameActive || mode === 'Precision') return;

    let intervalId: NodeJS.Timeout;

    if (mode === 'Acceleration') {
      intervalId = setInterval(() => {
        flashTarget();
        setFlashSpeed((prev) => Math.max(300, prev - 30));
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
      setHits((h) => h + 1);
    } else {
      setMisses((m) => m + 1);
      triggerMissFlash();
      if (mode === 'Sudden Death') setTimeLeft(0);
    }
    setTargetIndex(null);
  };

  const handleMissClick = () => {
    if (!gameActive) return;
    setMisses((m) => m + 1);
    triggerMissFlash();
    setTargetIndex(null);
    if (mode === 'Sudden Death') setTimeLeft(0);
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    onComplete(score);
  };

  // --- Screens ---

  if (!gameActive && countdown === null && !showSummary) {
    return (
      <div style={styles.container}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: 8 }}>Batak</h1>
        <p style={{ fontSize: '1rem', color: '#ccc', maxWidth: '500px', marginBottom: 24 }}>
          Test your reflexes by clicking the circles as they light up. Choose a mode below and get ready to react fast!
        </p>
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} style={styles.select}>
          <option value="Classic">Classic</option>
          <option value="Speed">Speed</option>
          <option value="Precision">Precision</option>
          <option value="Sudden Death">Sudden Death</option>
          <option value="Acceleration">Acceleration</option>
        </select>
        <button onClick={handleStart} style={{ ...styles.button, marginTop: 16 }}>Start</button>
      </div>
    );
  }
  

  if (countdown !== null) {
    return (
      <div style={styles.container}>
        <h2>🎬 Get Ready...</h2>
        <div style={{ fontSize: 64, fontWeight: 'bold', marginTop: 12 }}>{countdown}</div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div style={styles.container}>
        <h2>🏁 Test Complete</h2>
        <p>✅ Hits: {hits}</p>
        <p>❌ Misses: {misses}</p>
        <p>🎯 Accuracy: {(hits / (hits + misses || 1) * 100).toFixed(1)}%</p>
        <p>🏆 Score: {score}</p>
        <button onClick={handleSummaryClose} style={styles.button}>Continue</button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, position: 'relative' }} onClick={handleMissClick}>
      {showMissFlash && <div style={styles.flashOverlay} />}
      <div style={{ position: 'absolute', top: 20, textAlign: 'center' }}>
        <h2 style={styles.header}>⏱ Time Left: {timeLeft}s</h2>
        <h3>🎯 Hits: {hits} | ❌ Misses: {misses}</h3>
      </div>
      <div style={styles.grid}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(i);
            }}
            style={{
              ...styles.circleButton,
              ...(i === targetIndex ? styles.active : {}),
              width: buttonSize,
              height: buttonSize,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BatakTest;
