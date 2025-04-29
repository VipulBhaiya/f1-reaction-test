import React from 'react';

const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, #1a1a1a 0%, #0e0e0e 80%)',
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
    textAlign: 'center' as const,
    overflow: 'hidden',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 300,
    letterSpacing: '2px',
    marginBottom: '20px',
    color: '#e10600',
    textShadow: '0 0 8px #e10600',
  },
  desc: {
    fontSize: '1.1rem',
    color: '#bbbbbb',
    maxWidth: '650px',
    marginBottom: '40px',
    lineHeight: 1.7,
  },
  button: {
    padding: '14px 30px',
    fontSize: '1.2rem',
    borderRadius: '10px',
    backgroundColor: '#e10600',
    border: '2px solid #e10600',
    cursor: 'pointer',
    color: '#ffffff',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
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
        Stay sharp. Every millisecond counts.
      </p>
      <button
        style={styles.button}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = '#e10600';
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 12px #e10600';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#e10600';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = '#e10600';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={onContinue}
      >
        Begin
      </button>
    </div>
  );
};

export default SimIntro;
