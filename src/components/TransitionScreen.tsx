import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionScreenProps {
  nextStep: string;
  message?: string;
  duration?: number;
  onDone: () => void;
  className?: string;
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const contentVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { scale: 1.1, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
};

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, #0e0e0e 0%, #000000 80%)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    zIndex: 9999,
  },
  message: {
    fontSize: '2.8rem',
    fontWeight: 300,
    color: '#e10600',
    textShadow: '0 0 12px #e10600',
    textAlign: 'center' as const,
    padding: '0 1.5rem',
    letterSpacing: '2px',
    userSelect: 'none' as const,
  },
};

const TransitionScreen: React.FC<TransitionScreenProps> = ({
  nextStep,
  message = 'Loading...',
  duration = 1500,
  onDone,
  className,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key={nextStep}
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={styles.backdrop}
        className={className}
        role="alert"
        aria-live="assertive"
      >
        <motion.div
          variants={pulseAnimation}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <motion.div variants={contentVariants}>
            <div style={styles.message}>{message}</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionScreen;
