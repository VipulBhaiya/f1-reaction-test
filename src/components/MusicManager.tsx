import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundMusic from '../assets/Music/backroundMusic.mp3'; // adjust path if needed

const MusicManager = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = 0.5;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        toggleMusic();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      showToast('Music Off');
    } else {
      audio.play().catch((err) => console.error('Playback failed', err));
      showToast('Music On');
    }
    setIsPlaying(!isPlaying);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500); // hide after 2.5s
  };

  return (
    <>
      <audio ref={audioRef} src={backgroundMusic} style={{ display: 'none' }} />

      {/* AnimatePresence handles mount/unmount animations */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="music-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '24px',
              backgroundColor: 'rgba(30,30,30,0.9)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 1000,
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicManager;
