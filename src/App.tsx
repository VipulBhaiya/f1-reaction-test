// App.tsx
import React, { useState } from 'react';
import BatakTest from './components/BatakTest';
import TennisBallTest from './components/TennisBallTest';
import LightsOutTest from './components/LightsOutTest';

const getCategory = (ms: number): string => {
  if (ms > 500) return 'Casual Fan';
  if (ms > 400) return 'Club Racer';
  if (ms > 300) return 'Semi-Pro';
  if (ms > 200) return 'F2 Prospect';
  return 'F1 Material';
};

const App = () => {
  const [step, setStep] = useState<'batak' | 'tennis' | 'lights' | 'result'>('batak');
  const [scores, setScores] = useState<number[]>([]);

  const handleComplete = (time: number) => {
    const newScores = [...scores, time];
    setScores(newScores);
    if (step === 'batak') setStep('tennis');
    else if (step === 'tennis') setStep('lights');
    else if (step === 'lights') setStep('result');
  };

  const handleRestart = () => {
    setScores([]);
    setStep('batak');
  };

  if (step === 'batak') return <BatakTest onComplete={handleComplete} />;
  if (step === 'tennis') return <TennisBallTest onComplete={handleComplete} />;
  if (step === 'lights') return <LightsOutTest onComplete={handleComplete} />;

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const category = getCategory(avg);

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>🏁 F1 Reaction Test Results</h1>
      <p>Batak Test: {scores[0]} ms</p>
      <p>Tennis Ball Catch: {scores[1]} ms</p>
      <p>Lights Out: {scores[2]} ms</p>
      <h2 style={{ marginTop: '20px' }}>Average: {avg} ms</h2>
      <h2 style={{ fontSize: '20px', margin: '10px 0' }}>Category: {category}</h2>
      <button onClick={handleRestart} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Restart
      </button>
    </div>
  );
};

export default App;
