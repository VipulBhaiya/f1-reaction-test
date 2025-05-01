import React, { useEffect, useState, useRef } from 'react';

// Import SFX
import tickSfx from '../assets/Sfx/click.mp3';
import goSfx from '../assets/Sfx/start_woosh.mp3';

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
    backgroundColor: '#1a1a1a',
    boxShadow: '0 0 6px #000',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  lit: {
    backgroundColor: '#e10600',
    boxShadow: '0 0 16px 6px rgba(225, 6, 0, 0.65)',
    transform: 'scale(1.2)',
  },
};

type Props = {
  onComplete: () => void;
  delayPerLight?: number;
  holdDuration?: number;
};

const F1StartLights: React.FC<Props> = ({
  onComplete,
  delayPerLight = 800,
  holdDuration = 1000,
}) => {
  const [litCount, setLitCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);
  const isMounted = useRef(true); // Track mount state
  const completed = useRef(false); // Prevent double-calling onComplete

  const tickAudio = useRef(new Audio(tickSfx));
  const goAudio = useRef(new Audio(goSfx));

  useEffect(() => {
    isMounted.current = true;

    if (litCount < 5) {
      const timer = setTimeout(() => {
        if (!isMounted.current) return;
        tickAudio.current.currentTime = 0;
        tickAudio.current.play();
        setLitCount((c) => c + 1);
      }, delayPerLight);
      return () => clearTimeout(timer);
    } else if (!completed.current) {
      const hold = setTimeout(() => {
        if (!isMounted.current) return;
        setLightsOut(true);
        goAudio.current.play();
        completed.current = true;
        onComplete();
      }, holdDuration);
      return () => clearTimeout(hold);
    }

    return () => {
      isMounted.current = false;
    };
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
