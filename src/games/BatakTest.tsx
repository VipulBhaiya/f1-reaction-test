import React, { useState, useEffect, useRef } from 'react';
import F1StartLights from '../components/F1StartLights';
import hitSound from '../assets/Sfx/hit.mp3';
import missSound from '../assets/Sfx/miss.mp3';
import suddenDeathMissSound from '../assets/Sfx/sudden-death-miss.mp3';
import lightUpSound from '../assets/Sfx/light-up.mp3';

type Mode = 'Classic' | 'Speed' | 'Sudden Death' | 'Acceleration';

type Props = {
  onComplete: (score: number) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    // background: 'radial-gradient(circle at center, #1a1a1a 0%, #0e0e0e 80%)', ❌ Removed
    background: 'none', // ✅ Allows background effect to show
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: '16px',
    zIndex: 1,
    marginTop: '40px',
  },
  circleButton: {
    borderRadius: '50%',
    backgroundColor: '#333',
    transition: 'opacity 0.5s ease, background-color 0.3s ease, transform 0.2s ease',
    cursor: 'pointer',
    opacity: 0.6,
  },
  active: {
    backgroundColor: '#e10600',
    opacity: 1,
    boxShadow: '0 0 30px 10px rgba(225, 6, 0, 0.7)',
    transform: 'scale(1.1)',
  },
  button: {
    padding: '14px 30px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    backgroundColor: '#e10600',
    border: '2px solid #e10600',
    color: '#ffffff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
  },
  select: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #555',
    marginTop: '12px',
    width: '220px',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(225, 6, 0, 0.3)',
    zIndex: 5,
    pointerEvents: 'none',
    animation: 'flash 0.15s linear',
  },
};

const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play().catch((e) => console.error('Sound playback failed', e));
};

const BatakTest: React.FC<Props> = ({ onComplete }) => {
  const [mode, setMode] = useState<Mode>('Classic');
  const [phase, setPhase] = useState<'start' | 'countdown' | 'playing' | 'summary'>('start');
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [showMissFlash, setShowMissFlash] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(1000);
  const [buttonSize, setButtonSize] = useState(Math.min(window.innerWidth, window.innerHeight) / 7);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentTargetTime, setCurrentTargetTime] = useState<number | null>(null);

  const flashTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalTime = 15;
  const rows = 4;
  const cols = 4;

  useEffect(() => {
    const resizeListener = () => setButtonSize(Math.min(window.innerWidth, window.innerHeight) / 7);
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;

    if (timeLeft <= 0 || (mode === 'Sudden Death' && misses > 0)) {
      setPhase('summary');
      calculateScore();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft, misses, mode]);

  useEffect(() => {
    if (phase !== 'playing') return;

    const speedMap: Record<Mode, number> = {
      Classic: 1000,
      Speed: 500,
      'Sudden Death': 1000,
      Acceleration: flashSpeed,
    };

    const interval = setInterval(() => {
      flashNewTarget();
      if (mode === 'Acceleration') {
        setFlashSpeed((prev) => Math.max(300, prev - 30));
      }
    }, speedMap[mode]);

    return () => clearInterval(interval);
  }, [phase, mode, flashSpeed]);

  const flashNewTarget = () => {
    playSound(lightUpSound);
    const newIndex = Math.floor(Math.random() * rows * cols);
    setTargetIndex(newIndex);
    setCurrentTargetTime(Date.now());

    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => {
      setTargetIndex(null);
    }, 700);
  };

  const triggerMissFlash = () => {
    playSound(suddenDeathMissSound);
    setShowMissFlash(true);
    setTimeout(() => setShowMissFlash(false), 150);
  };

  const handleStart = () => {
    setHits(0);
    setMisses(0);
    setScore(0);
    setFlashSpeed(1000);
    setTimeLeft(totalTime);
    setPhase('countdown');
    setReactionTimes([]);
    setCurrentTargetTime(null);
  };

  const handleClick = (i: number) => {
    if (phase !== 'playing') return;

    if (i === targetIndex && currentTargetTime !== null) {
      playSound(hitSound);
      const reaction = Date.now() - currentTargetTime;
      setReactionTimes((prev) => [...prev, reaction]);
      setHits((h) => h + 1);
    } else {
      playSound(missSound);
      setMisses((m) => m + 1);
      triggerMissFlash();
      if (mode === 'Sudden Death') setTimeLeft(0);
    }
    setTargetIndex(null);
    setCurrentTargetTime(null);
  };

  const handleMissClick = () => {
    if (phase !== 'playing') return;

    playSound(missSound);
    setMisses((m) => m + 1);
    triggerMissFlash();
    setTargetIndex(null);
    if (mode === 'Sudden Death') setTimeLeft(0);
  };

  const calculateScore = () => {
    const totalAttempts = hits + misses;
    const accuracy = totalAttempts > 0 ? hits / totalAttempts : 1;
    const avgReaction = totalTime / (totalAttempts || 1);
    const rawScore = (accuracy * 70) + (30 * (1 - avgReaction / 2.5));
    const finalScore = Math.max(0, Math.round(rawScore));
    setScore(finalScore);
  };

  const handleSummaryClose = () => {
    setPhase('start');
    onComplete(score);
  };

  if (phase === 'start') {
    return (
      <div style={styles.container}>
        <h1 style={{ fontSize: '3rem', fontWeight: 300, color: '#e10600', textShadow: '0 0 10px #e10600' }}>
        🔴 Batak Reflex Test
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#bbbbbb', marginTop: '12px', marginBottom: '24px', maxWidth: '500px' }}>
          Choose your challenge mode and test your reactions under pressure. Tap the targets as fast and accurately as possible!
        </p>
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} style={styles.select}>
          <option value="Classic">Classic</option>
          <option value="Speed">Speed</option>
          <option value="Sudden Death">Sudden Death</option>
          <option value="Acceleration">Acceleration</option>
        </select>
        <button
          onClick={handleStart}
          style={styles.button}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Start
        </button>
      </div>
    );
  }  

  if (phase === 'countdown') {
    return (
      <div style={styles.container}>
        <h2>🎬 Get Ready...</h2>
        <F1StartLights onComplete={() => setPhase('playing')} />
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div style={styles.container}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 300, color: '#e10600', textShadow: '0 0 8px #e10600' }}>
          🏁 Test Complete!
        </h1>
  
        <div style={{
          marginTop: '24px',
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
          <p>⏱️ Avg Reaction: <strong>
            {reactionTimes.length > 0
              ? `${Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)} ms`
              : 'N/A'}
          </strong></p>
          <p>🎯 Accuracy: <strong>{(hits / (hits + misses || 1) * 100).toFixed(1)}%</strong></p>
          <p>🔥 Score: <strong>{score}</strong></p>
        </div>
  
        <button
          onClick={handleSummaryClose}
          style={{ ...styles.button, marginTop: '32px', width: '220px' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Continue
        </button>
      </div>
    );
  }
  

  return (
    <div style={styles.container} onClick={handleMissClick}>
      {showMissFlash && <div style={styles.flashOverlay} />}
      <div style={{ position: 'absolute', top: 20 }}>
        <h2>⏱ Time Left: {timeLeft}s</h2>
        <h3>✅ Hits: {hits} | ❌ Misses: {misses}</h3>
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
