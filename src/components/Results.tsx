import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

interface ResultsProps {
  scores: number[]; // already normalized from individual tests
  onRestart: () => void;
  onLeaderboard: () => void;
}

const Results: React.FC<ResultsProps> = ({ scores, onRestart, onLeaderboard }) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  if (scores.length !== 3) return null;

  const finalScore = Math.round((scores[0] + scores[1] + scores[2]) / 3);

  let category = '';
  if (finalScore >= 90) category = 'F1 Material';
  else if (finalScore >= 75) category = 'F2 Prospect';
  else if (finalScore >= 60) category = 'Semi-Pro';
  else if (finalScore >= 45) category = 'Club Racer';
  else category = 'Casual Fan';

  const saveScore = async () => {
    try {
      const scoreRef = ref(db, 'scores');
      await push(scoreRef, {
        name: name.trim() || 'Anonymous',
        average: finalScore,
        category,
        batak: scores[0],
        tennis: scores[1],
        lights: scores[2],
        timestamp: Date.now(),
      });
      setScoreSaved(true);
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1>🏁 Results</h1>
      <p>Batak: {scores[0]}/100</p>
      <p>Tennis: {scores[1]}/100</p>
      <p>Lights: {scores[2]}/100</p>
      <h2>Final Score: {finalScore}/100</h2>
      <h2>Category: {category}</h2>

      {!submitted && (
        <div style={{ marginTop: '30px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name (optional)"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '8px',
              width: '250px'
            }}
          />
          <div>
            <button onClick={saveScore} style={{ marginTop: '10px' }}>
              Submit Score
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
          ✅ Score submitted!
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onLeaderboard}>Leaderboard</button>
      </div>
    </div>
  );
};

export default Results;
