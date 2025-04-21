import React, { useEffect, useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

interface ResultsProps {
  scores: number[];
  onRestart: () => void;
  onLeaderboard: () => void;
  devMode?: boolean;
}

const Results: React.FC<ResultsProps> = ({
  scores,
  onRestart,
  onLeaderboard,
  devMode = false,
}) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const usedScores = devMode ? [88, 92, 85] : scores;

  if (usedScores.length !== 3) return null;

  const finalScore = Math.round(
    (usedScores[0] + usedScores[1] + usedScores[2]) / 3
  );
  const submissionKey = `submitted_${finalScore}_${usedScores.join('_')}`;

  useEffect(() => {
    if (sessionStorage.getItem(submissionKey) === 'true') {
      setSubmitted(true);
    }
  }, [submissionKey]);

  let category = '';
  if (finalScore >= 90) category = 'F1 Material';
  else if (finalScore >= 75) category = 'F2 Prospect';
  else if (finalScore >= 60) category = 'Semi-Pro';
  else if (finalScore >= 45) category = 'Club Racer';
  else category = 'Casual Fan';

  const saveScore = async () => {
    if (devMode) {
      console.log('🛠 Dev mode: Skipping score save.');
      return;
    }

    try {
      const scoreRef = ref(db, 'scores');
      await push(scoreRef, {
        name: name.trim() || 'Anonymous',
        average: finalScore,
        category,
        batak: usedScores[0],
        tennis: usedScores[1],
        lights: usedScores[2],
        timestamp: Date.now(),
      });
      setSubmitted(true);
      sessionStorage.setItem(submissionKey, 'true');
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏁 Results</h1>
        <div style={styles.scoreBox}>
          <p>🟡 Batak: {usedScores[0]}/100</p>
          <p>🎾 Tennis: {usedScores[1]}/100</p>
          <p>💡 Lights: {usedScores[2]}/100</p>
        </div>

        <h2 style={styles.subheader}>Final Score: {finalScore}/100</h2>
        <h2 style={styles.subheader}>Category: {category}</h2>

        {!submitted && !devMode ? (
          <div style={styles.inputSection}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name (optional)"
              style={styles.input}
            />
            <button onClick={saveScore} style={styles.button}>
              Submit Score
            </button>
          </div>
        ) : devMode ? (
          <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#ccc' }}>
            🛠 Dev Mode: Score not submitted
          </p>
        ) : (
          <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#0f0' }}>
            ✅ Score submitted!
          </p>
        )}

        <div style={styles.buttonGroup}>
          <button onClick={onRestart} style={styles.button}>
            Restart
          </button>
          <button onClick={onLeaderboard} style={styles.button}>
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '40px 24px',
    borderRadius: '16px',
    backgroundColor: '#2c2c2c',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: 12,
  },
  scoreBox: {
    fontSize: '1.2rem',
    lineHeight: '1.8rem',
    marginBottom: 16,
  },
  subheader: {
    fontSize: '1.5rem',
    margin: '8px 0',
  },
  inputSection: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: 10,
    width: '260px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  buttonGroup: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
  },
};

export default Results;
