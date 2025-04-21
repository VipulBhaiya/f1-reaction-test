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

const Leaderboard = ({ onBack }: { onBack: () => void }) => {
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
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h2>🏆 Leaderboard - Top 10</h2>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>Rank</th>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Score</th>
            <th style={{ padding: '8px' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <tr key={index}>
              <td style={{ padding: '8px' }}>{index + 1}</td>
              <td
                style={{
                  padding: '8px',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedUser(entry)}
              >
                {entry.name || 'Anonymous'}
              </td>
              <td style={{ padding: '8px' }}>{entry.average}</td>
              <td style={{ padding: '8px' }}>{entry.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#242',
            width: 'fit-content',
            marginInline: 'auto',
          }}
        >
          <h3>📊 Stats for {selectedUser.name || 'Anonymous'}</h3>
          <p><strong>Category:</strong> {selectedUser.category}</p>
          <p><strong>Score:</strong> {selectedUser.average}</p>

          {/* Individual Test Scores */}
          {selectedUser.batak !== undefined && (
            <p><strong>Batak Score:</strong> {selectedUser.batak} </p>
          )}
          {selectedUser.tennis !== undefined && (
            <p><strong>Tennis Score:</strong> {selectedUser.tennis} </p>
          )}
          {selectedUser.lights !== undefined && (
            <p><strong>Lights Score:</strong> {selectedUser.lights} </p>
          )}

          {/* Optional extra stats */}
          {selectedUser.accuracy !== undefined && (
            <p><strong>Accuracy:</strong> {(selectedUser.accuracy * 100).toFixed(1)}%</p>
          )}
          {selectedUser.hits !== undefined && (
            <p><strong>Hits:</strong> {selectedUser.hits}</p>
          )}
          {selectedUser.misses !== undefined && (
            <p><strong>Misses:</strong> {selectedUser.misses}</p>
          )}
          {selectedUser.averageTime !== undefined && (
            <p><strong>Avg Time per Light:</strong> {selectedUser.averageTime.toFixed(2)} ms</p>
          )}

          <button
            onClick={() => setSelectedUser(null)}
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      <button
        onClick={onBack}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Back to Results
      </button>
    </div>
  );
};

export default Leaderboard;
