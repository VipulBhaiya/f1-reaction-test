import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import BatakTest from './games/BatakTest';
import TennisBallTest from './games/TennisBallTest';
import LightsOutTest from './games/LightsOutTest';
import Leaderboard from './components/Leaderboard';
import DevMenu from './components/DevMenu';
import Results from './components/Results';
import MainMenu from './components/MainMenu';
import SimIntro from './components/SimIntro';
import TransitionScreen from './components/TransitionScreen';
import MusicManager from './components/MusicManager';

type Step =
  | 'main-menu'
  | 'sim-intro'
  | 'batak'
  | 'tennis'
  | 'lights'
  | 'result'
  | 'leaderboard'
  | 'transition';

const App = () => {
  const [step, setStep] = useState<Step>('main-menu');
  const [nextStep, setNextStep] = useState<Step | null>(null);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [transitionDuration, setTransitionDuration] = useState(1600);
  const [scores, setScores] = useState<number[]>([]);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') {
        setDevMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const goToStep = (target: Step, message: string, duration = 1600) => {
    setTransitionMessage(message);
    setNextStep(target);
    setTransitionDuration(duration);
    setStep('transition');
  };

  const handleComplete = (score: number) => {
    setScores((prev) => [...prev, score]);
    if (!devMode) {
      switch (step) {
        case 'batak':
          goToStep('tennis', 'Next Up: Tennis Ball Catch');
          break;
        case 'tennis':
          goToStep('lights', 'Final Test: Lights Out');
          break;
        case 'lights':
          goToStep('result', 'Calculating Results...', 1400);
          break;
      }
    }
  };

  const handleRestart = () => {
    setScores([]);
    setStep('main-menu');
  };

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1.2, ease: 'easeInOut' },
  };

  const renderStep = () => {
    switch (step) {
      case 'main-menu':
        return (
          <motion.div key="main-menu" {...fade}>
            <MainMenu
              onStart={() => goToStep('sim-intro', 'Welcome to the Simulator')}
              onViewLeaderboard={() => setStep('leaderboard')}
            />
          </motion.div>
        );
      case 'sim-intro':
        return (
          <motion.div key="sim-intro" {...fade}>
            <SimIntro onContinue={() => goToStep('batak', 'Get Ready: Batak Reflex Grid')} />
          </motion.div>
        );
      case 'batak':
        return (
          <motion.div key="batak" {...fade}>
            <BatakTest onComplete={handleComplete} />
          </motion.div>
        );
      case 'tennis':
        return (
          <motion.div key="tennis" {...fade}>
            <TennisBallTest onComplete={handleComplete} />
          </motion.div>
        );
      case 'lights':
        return (
          <motion.div key="lights" {...fade}>
            <LightsOutTest onComplete={handleComplete} />
          </motion.div>
        );
      case 'result':
        return (
          <motion.div key="result" {...fade}>
            <Results
              scores={scores}
              onRestart={handleRestart}
              onLeaderboard={() => setStep('leaderboard')}
              devMode={devMode}
            />
          </motion.div>
        );
      case 'leaderboard':
        return (
          <motion.div key="leaderboard" {...fade}>
            <Leaderboard onBack={() => setStep('result')} />
          </motion.div>
        );
      case 'transition':
        return (
          <TransitionScreen
            nextStep={nextStep || 'main-menu'}
            message={transitionMessage}
            duration={transitionDuration}
            onDone={() => setStep(nextStep!)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Floating Music Button */}
      <div className="absolute bottom-6 right-6 z-30">
        <MusicManager />
      </div>

      {/* Dev Mode (press D to toggle) */}
      {devMode && (
        <DevMenu
          currentStep={step}
          onSelectTest={(target) => setStep(target)}
          onExitDevMode={() => setDevMode(false)}
        />
      )}

      {/* Main Game Screens */}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default App;
