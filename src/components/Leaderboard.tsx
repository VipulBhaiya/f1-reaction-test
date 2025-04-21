import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface ScoreEntry {
  name: string;
  average: number;
  category: string;
  timestamp: number;
  batak?: number;
  tennis?: number;
  lights?: number;
  accuracy?: number;
  hits?: number;
  misses?: number;
  averageTime?: number;
}

const Leaderboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<ScoreEntry | null>(null);

  useEffect(() => {
    const scoresRef = ref(db, 'scores');
    onValue(scoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data) as ScoreEntry[];
        const sorted = entries
          .filter((entry) => typeof entry.average === 'number')
          .sort((a, b) => b.average - a.average)
          .slice(0, 10);
        setScores(sorted);
      }
    });
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>🏆 Leaderboard - Top 10</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Category</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((entry, index) => (
              <tr key={index}>
                <td style={styles.td}>{index + 1}</td>
                <td
                  style={styles.clickableName}
                  onClick={() => setSelectedUser(entry)}
                >
                  {entry.name || 'Anonymous'}
                </td>
                <td style={styles.td}>{entry.average}</td>
                <td style={styles.td}>{entry.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onBack} style={{ ...styles.button, backgroundColor: '#28a745' }}>
          Back to Results
        </button>
      </div>

      {/* Stats panel positioned next to the table */}
      <div
        style={{
          ...styles.statsPanel,
          opacity: selectedUser ? 1 : 0,
          pointerEvents: selectedUser ? 'auto' : 'none',
        }}
      >
        {selectedUser && (
          <div style={styles.statsBox}>
            <h3>📊 Stats for {selectedUser.name || 'Anonymous'}</h3>
            <p><strong>Category:</strong> {selectedUser.category}</p>
            <p><strong>Score:</strong> {selectedUser.average}</p>
            {selectedUser.batak !== undefined && <p><strong>Batak:</strong> {selectedUser.batak}</p>}
            {selectedUser.tennis !== undefined && <p><strong>Tennis:</strong> {selectedUser.tennis}</p>}
            {selectedUser.lights !== undefined && <p><strong>Lights:</strong> {selectedUser.lights}</p>}
            {selectedUser.accuracy !== undefined && <p><strong>Accuracy:</strong> {(selectedUser.accuracy * 100).toFixed(1)}%</p>}
            {selectedUser.hits !== undefined && <p><strong>Hits:</strong> {selectedUser.hits}</p>}
            {selectedUser.misses !== undefined && <p><strong>Misses:</strong> {selectedUser.misses}</p>}
            {selectedUser.averageTime !== undefined && <p><strong>Avg Light Time:</strong> {selectedUser.averageTime.toFixed(2)} ms</p>}
            <button onClick={() => setSelectedUser(null)} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
              Close
            </button>
          </div>
        )}
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
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    padding: 20,
  },
  container: {
    backgroundColor: '#2c2c2c',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    textAlign: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
    backgroundColor: '#333',
    borderRadius: '10px',
  },
  th: {
    padding: '8px 12px',
    backgroundColor: '#444',
    borderBottom: '2px solid #555',
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #555',
    textAlign: 'center',
  },
  clickableName: {
    padding: '8px 12px',
    color: '#ffc107',
    textDecoration: 'underline',
    cursor: 'pointer',
    borderBottom: '1px solid #555',
    textAlign: 'center',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  statsPanel: {
    position: 'absolute',
    left: 'calc(50% + 240px)', // 200px (half width) + 40px margin
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#242',
    borderRadius: '16px',
    padding: '24px',
    width: '300px',
    maxHeight: '80vh',
    overflowY: 'auto',
    transition: 'opacity 0.4s ease',
    zIndex: 0,
  },
  statsBox: {
    color: 'white',
    textAlign: 'left',
  },
};

export default Leaderboard;
