import React from 'react';

const styles = {
  container: {
    position: 'fixed' as const,  // Lock to viewport
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, #1a1a1a 0%, #0e0e0e 80%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center' as const,
    gap: '24px',
    padding: '20px',
    overflow: 'hidden',  // <- Prevent any accidental scroll
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 200,
    letterSpacing: '2px',
    marginBottom: '20px',
    color: '#e10600',
    textShadow: '0 0 10px rgba(225, 6, 0, 0.7)',
  },
  button: {
    padding: '14px 28px',
    fontSize: '1.2rem',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    border: '2px solid #e10600',
    color: '#ffffff',
    cursor: 'pointer',
    minWidth: '220px',
    transition: 'all 0.3s ease',
  },
};

type MainMenuProps = {
  onStart: () => void;
  onViewLeaderboard: () => void;
};

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onViewLeaderboard }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>F1 Reaction Challenge</h1>
      <button
        style={styles.button}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e10600';
          e.currentTarget.style.color = '#0e0e0e';
          e.currentTarget.style.boxShadow = '0 0 15px #e10600';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={onStart}
      >
        🚦 Start Test
      </button>
      <button
        style={styles.button}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e10600';
          e.currentTarget.style.color = '#0e0e0e';
          e.currentTarget.style.boxShadow = '0 0 15px #e10600';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={onViewLeaderboard}
      >
        🏆 Leaderboard
      </button>
    </div>
  );
};

export default MainMenu;
