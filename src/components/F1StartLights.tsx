import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  light: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#333',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 0 6px #000',
  },
  lit: {
    backgroundColor: '#ff1c1c',
    boxShadow: '0 0 12px 4px rgba(255, 0, 0, 0.6)',
  },
};

type Props = {
  onComplete: () => void;
  delayPerLight?: number;   // default: 800ms
  holdDuration?: number;    // default: 1000ms
};

const F1StartLights: React.FC<Props> = ({
  onComplete,
  delayPerLight = 800,
  holdDuration = 1000,
}) => {
  const [litCount, setLitCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);

  useEffect(() => {
    if (litCount < 5) {
      const timer = setTimeout(() => setLitCount((c) => c + 1), delayPerLight);
      return () => clearTimeout(timer);
    } else {
      const hold = setTimeout(() => {
        setLightsOut(true);
        onComplete();
      }, holdDuration);
      return () => clearTimeout(hold);
    }
  }, [litCount, delayPerLight, holdDuration, onComplete]);

  return (
    <div style={styles.container}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.light,
            ...(litCount > i && !lightsOut ? styles.lit : {}),
          }}
        />
      ))}
    </div>
  );
};

export default F1StartLights;
