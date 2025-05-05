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
        <h1 style={styles.title}>🏁 Final Results</h1>

        <div style={styles.scoreBox}>
          <p>🟡 Batak: {usedScores[0]} / 100</p>
          <p>🎾 Tennis: {usedScores[1]} / 100</p>
          <p>💡 Lights: {usedScores[2]} / 100</p>
        </div>

        <h2 style={styles.subheader}>Final Score: {finalScore} / 100</h2>
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
            <button onClick={saveScore} style={styles.mainButton}>
              Submit Score
            </button>
          </div>
        ) : devMode ? (
          <p style={styles.devMessage}>🛠 Dev Mode: Score not submitted</p>
        ) : (
          <p style={styles.successMessage}>✅ Score submitted!</p>
        )}

        <div style={styles.buttonGroup}>
          <button onClick={onRestart} style={styles.secondaryButton}>
            Restart
          </button>
          <button onClick={onLeaderboard} style={styles.secondaryButton}>
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'none',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '20px',
  },
  container: {
    backgroundColor: '#111',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 0 20px #e10600aa',
    textAlign: 'center',
    width: '400px',
    maxWidth: '90%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#e10600',
    textShadow: '0 0 10px #e10600',
    marginBottom: '16px',
  },
  scoreBox: {
    fontSize: '1.2rem',
    lineHeight: '1.8rem',
    marginBottom: '24px',
  },
  subheader: {
    fontSize: '1.5rem',
    color: '#ffffff',
    margin: '8px 0',
  },
  inputSection: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 🔥 This centers children horizontally
    gap: '12px',
    width: '100%',
  },  
  input: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '8px',
    width: '80%', // ✅ instead of 100%
    maxWidth: '300px',
    border: '1px solid #555',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    outline: 'none',
  },  
  mainButton: {
    backgroundColor: '#e10600',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    backgroundColor: '#333',
    color: '#ffffff',
    border: '2px solid #e10600',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  successMessage: {
    color: '#00ff88',
    fontWeight: 'bold',
    marginTop: '12px',
  },
  devMessage: {
    color: '#ffcc00',
    fontWeight: 'bold',
    marginTop: '12px',
  },
  buttonGroup: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },
};

export default Results;
