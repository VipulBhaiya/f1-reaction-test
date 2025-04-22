import React from 'react';

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    textAlign: 'center' as const,
    gap: 20,
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: '12px 24px',
    fontSize: '1.1rem',
    borderRadius: 10,
    backgroundColor: '#ffc107',
    border: 'none',
    cursor: 'pointer',
    color: '#000',
    fontWeight: 'bold',
    minWidth: '200px',
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
      <button style={styles.button} onClick={onStart}>🚦 Start Test</button>
      <button style={styles.button} onClick={onViewLeaderboard}>🏆 Leaderboard</button>
    </div>
  );
};

export default MainMenu;
