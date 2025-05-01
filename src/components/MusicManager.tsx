import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import calmAmbient from '../assets/Music/mainScreen.mp3';
import simIntroAmbient from '../assets/Music/intro.mp3';
import batakEnergetic from '../assets/Music/batak-energetic.mp3';
import tennisBouncy from '../assets/Music/tennis-bouncy.mp3';
import lightsFuturistic from '../assets/Music/lights-futuristic.mp3';
import resultVictory from '../assets/Music/result-victory.mp3';
import leaderboardVictory from '../assets/Music/leaderboard-victory.mp3';
import transitionSting from '../assets/Sfx/transition-explosion-121425.mp3';

interface MusicManagerProps {
  step: string;
}

const stepToMusic: { [key: string]: string } = {
  'main-menu': calmAmbient,
  'sim-intro': simIntroAmbient,
  'batak': batakEnergetic,
  'tennis': tennisBouncy,
  'lights': lightsFuturistic,
  'result': resultVictory,
  'leaderboard': leaderboardVictory,
  'transition': transitionSting,
};

const MusicManager = ({ step }: MusicManagerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('musicMuted');
    if (savedMuteState) {
      setIsMuted(savedMuteState === 'true');
    }
  }, []);

  useEffect(() => {
    const newTrack = stepToMusic[step] || calmAmbient;
    if (!audioRef.current) return;

    if (currentTrack !== newTrack) {
      audioRef.current.src = newTrack;
      if (!isMuted) {
        audioRef.current.play().catch(err => console.error('Playback error:', err));
      }
      setCurrentTrack(newTrack);
    }
  }, [step, currentTrack, isMuted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().catch(err => console.error('Playback error:', err));
      showToast('Music On');
    } else {
      audioRef.current.pause();
      showToast('Music Off');
    }
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('musicMuted', String(newMuteState));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === '1') {
        toggleMusic();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMuted]);

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }} loop muted={isMuted} />
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
