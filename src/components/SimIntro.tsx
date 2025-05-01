import React from 'react';

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'none', // Background removed to reveal underlying effects
  color: '#ffffff',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 20px',
  textAlign: 'center',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 300,
  letterSpacing: '2px',
  marginBottom: '20px',
  color: '#e10600',
  textShadow: '0 0 8px #e10600',
};

const descStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#bbbbbb',
  maxWidth: '650px',
  marginBottom: '40px',
  lineHeight: 1.7,
};

const buttonStyle: React.CSSProperties = {
  padding: '14px 30px',
  fontSize: '1.2rem',
  borderRadius: '10px',
  backgroundColor: '#e10600',
  border: '2px solid #e10600',
  cursor: 'pointer',
  color: '#ffffff',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
};

const SimIntro: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = '#ffffff';
    target.style.color = '#e10600';
    target.style.borderColor = '#ffffff';
    target.style.transform = 'scale(1.05)';
    target.style.boxShadow = '0 0 12px #e10600';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.style.backgroundColor = '#e10600';
    target.style.color = '#ffffff';
    target.style.borderColor = '#e10600';
    target.style.transform = 'scale(1)';
    target.style.boxShadow = 'none';
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>F1 Reaction Simulator</h2>
      <p style={descStyle}>
        Welcome to the F1 Reflex Challenge — a 3-part test designed to measure your speed, precision, and reaction under pressure. You'll face:
        <br /><br />
        🔴 Batak — Tap targets as they light up.<br />
        🎾 Tennis Catch — Click falling balls before they land.<br />
        💡 Lights Out — React the instant the screen turns green.
        <br /><br />
        Stay sharp. Every millisecond counts.
      </p>
      <button
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onContinue}
      >
        Begin
      </button>
    </div>
  );
};

export default SimIntro;
