import React from 'react';

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#121212',
    color: 'white',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  desc: {
    fontSize: '1rem',
    color: '#ccc',
    maxWidth: '600px',
    marginBottom: '28px',
    lineHeight: 1.6,
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    borderRadius: '10px',
    backgroundColor: '#ffc107',
    border: 'none',
    cursor: 'pointer',
    color: '#000',
    fontWeight: 'bold',
  },
};

const SimIntro = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>F1 Reaction Simulator</h2>
      <p style={styles.desc}>
        Welcome to the F1 Reflex Challenge — a 3-part test designed to measure your speed, precision, and reaction under pressure. You'll face:
        <br /><br />
        🟡 Batak — Tap targets as they light up.<br />
        🎾 Tennis Catch — Click falling balls before they land.<br />
        💡 Lights Out — React the instant the screen turns green.
        <br /><br />
        Keep your focus. Every millisecond counts.
      </p>
      <button style={styles.button} onClick={onContinue}>Begin</button>
    </div>
  );
};

export default SimIntro;
