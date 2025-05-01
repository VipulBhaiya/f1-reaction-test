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
        <h2 style={styles.title}>🏆 Top 10 Leaderboard</h2>
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
                <td style={styles.td}>{Math.round(entry.average)}</td>
                <td style={styles.td}>{entry.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onBack} style={styles.backButton}>
          Return
        </button>
      </div>

      {selectedUser && (
        <div style={styles.statsPanel}>
          <h3 style={styles.statsTitle}>📊 {selectedUser.name || 'Anonymous'}</h3>
          <div style={styles.statsBox}>
            <p><strong>Category:</strong> {selectedUser.category}</p>
            <p><strong>Score:</strong> {selectedUser.average}</p>
            {selectedUser.batak !== undefined && <p><strong>Batak:</strong> {selectedUser.batak}</p>}
            {selectedUser.tennis !== undefined && <p><strong>Tennis:</strong> {selectedUser.tennis}</p>}
            {selectedUser.lights !== undefined && <p><strong>Lights:</strong> {selectedUser.lights}</p>}
            {selectedUser.accuracy !== undefined && <p><strong>Accuracy:</strong> {(selectedUser.accuracy * 100).toFixed(1)}%</p>}
            {selectedUser.hits !== undefined && <p><strong>Hits:</strong> {selectedUser.hits}</p>}
            {selectedUser.misses !== undefined && <p><strong>Misses:</strong> {selectedUser.misses}</p>}
            {selectedUser.averageTime !== undefined && <p><strong>Avg Light Time:</strong> {selectedUser.averageTime.toFixed(2)} ms</p>}
          </div>
          <button onClick={() => setSelectedUser(null)} style={styles.closeButton}>
            ❌ Close
          </button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'none',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px',
  },
  container: {
    backgroundColor: '#111',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 0 20px #e10600aa',
    width: '90%',
    maxWidth: '360px',
    maxHeight: '80vh',         // ✅ restrict height
    overflowY: 'auto',         // ✅ allow scroll if needed
    textAlign: 'center',
    zIndex: 2,
  },  
  title: {
    fontSize: '2rem',
    color: '#e10600',
    marginBottom: '16px',
    textShadow: '0 0 8px #e10600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  th: {
    padding: '10px 12px',
    backgroundColor: '#2c2c2c',
    borderBottom: '2px solid #e10600',
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #333',
    textAlign: 'center',
    color: '#ccc',
  },
  clickableName: {
    padding: '8px 12px',
    color: '#00eaff',
    textDecoration: 'underline',
    cursor: 'pointer',
    borderBottom: '1px solid #333',
    textAlign: 'center',
  },
  backButton: {
    marginTop: '20px',
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#e10600',
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s ease',
  },
  statsPanel: {
    position: 'absolute',
    right: '5%',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#111',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 0 20px #00eaff88',
    width: '85%',
    maxWidth: '300px',
    maxHeight: '70vh',         // ✅ restrict height
    overflowY: 'auto',         // ✅ scrollable if too much content
    zIndex: 1,
    color: '#ffffff',
  },  
  statsTitle: {
    fontSize: '1.5rem',
    color: '#00eaff',
    textAlign: 'center',
    marginBottom: '12px',
  },
  statsBox: {
    textAlign: 'left',
    fontSize: '0.95rem',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 18px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s ease',
  },
};

export default Leaderboard;
