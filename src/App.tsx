// App.tsx
import React, { useState } from 'react';
import BatakTest from './components/BatakTest';
import TennisBallTest from './components/TennisBallTest';
import LightsOutTest from './components/LightsOutTest';
import Leaderboard from './components/Leaderboard';
import DevMenu from './components/DevMenu';
import Results from './components/Results';

const App = () => {
  const [step, setStep] = useState<'batak' | 'tennis' | 'lights' | 'result' | 'leaderboard'>('batak');
  const [scores, setScores] = useState<number[]>([]);
  const [devMode, setDevMode] = useState(false);

  const handleComplete = (time: number) => {
    setScores((prev) => {
      const updated = [...prev, time];
      if (!devMode) {
        if (step === 'batak') setStep('tennis');
        else if (step === 'tennis') setStep('lights');
        else if (step === 'lights') setStep('result');
      }
      return updated;
    });
  };

  const handleRestart = () => {
    setScores([]);
    setStep('batak');
  };

  if (step === 'leaderboard') {
    return (
      <>
        {devMode && (
          <DevMenu
            currentStep={step}
            onSelectTest={(test) => setStep(test)}
            onExitDevMode={() => setDevMode(false)}
          />
        )}
        <Leaderboard onBack={() => setStep('result')} />
      </>
    );
  }

  return (
    <div>
      {devMode && (
        <DevMenu
          currentStep={step}
          onSelectTest={(test) => setStep(test)}
          onExitDevMode={() => setDevMode(false)}
        />
      )}
      {!devMode && (
        <button
          onClick={() => setDevMode(true)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '8px 12px',
            fontSize: '12px',
            backgroundColor: '#444',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Enter Dev Mode
        </button>
      )}

      {step === 'batak' && (
        <BatakTest
          onComplete={handleComplete}
          devMode={devMode}
          onNext={() => setStep('tennis')}
        />
      )}
      {step === 'tennis' && (
        <TennisBallTest
          onComplete={handleComplete}
          devMode={devMode}
          onNext={() => setStep('lights')}
        />
      )}
      {step === 'lights' && (
        <LightsOutTest
          onComplete={handleComplete}
          devMode={devMode}
          onNext={() => setStep('result')}
        />
      )}
      {step === 'result' && (
        <Results
          scores={scores}
          onRestart={handleRestart}
          onLeaderboard={() => setStep('leaderboard')}
          devMode={devMode}
        />
      )}
    </div>
  );
};

export default App;
