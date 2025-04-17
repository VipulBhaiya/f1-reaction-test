import React, { useState, useEffect } from 'react';

type Props = {
  onComplete: (avgMs: number) => void;
};

const TOTAL_HITS = 10;
const BUTTON_COUNT = 9;

const BatakTest: React.FC<Props> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [round, setRound] = useState<number>(0);

  useEffect(() => {
    if (round >= TOTAL_HITS) {
      const avg = Math.round(
        reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      );
      onComplete(avg);
      return;
    }

    const delay = Math.random() * 1500 + 500; // 500ms - 2000ms
    const timer = setTimeout(() => {
      const nextIndex = Math.floor(Math.random() * BUTTON_COUNT);
      setActiveIndex(nextIndex);
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(timer);
  }, [round]);

  const handleClick = (index: number) => {
    if (index === activeIndex) {
      const rt = Date.now() - startTime;
      setReactionTimes([...reactionTimes, rt]);
      setActiveIndex(null);
      setRound((r) => r + 1);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#111',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 64px)',
    gap: '12px',
    marginBottom: '24px'
  };

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    backgroundColor: active ? 'red' : '#333',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>BATAK Simulator</h2>
      <div style={gridStyle}>
        {Array.from({ length: BUTTON_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={buttonStyle(i === activeIndex)}
          />
        ))}
      </div>
      <p>Click the red button as fast as you can!</p>
      <p style={{ marginTop: '8px', fontSize: '14px', color: '#aaa' }}>
        Round {round + 1} / {TOTAL_HITS}
      </p>
    </div>
  );
};

export default BatakTest;
