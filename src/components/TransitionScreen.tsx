import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TransitionScreenProps = {
  nextStep: string;
  message?: string;
  duration?: number;
  onDone: () => void;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  message: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#ffc107',
    textAlign: 'center',
    padding: '0 20px',
  },
};

const TransitionScreen: React.FC<TransitionScreenProps> = ({
  nextStep,
  message = 'Loading...',
  duration = 1500,
  onDone,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key={nextStep}
        style={styles.container}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div style={styles.message}>{message}</div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionScreen;
