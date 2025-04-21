import React from 'react';

type DevMenuProps = {
  currentStep: 'batak' | 'tennis' | 'lights' | 'result' | 'leaderboard';
  onSelectTest: (test: 'batak' | 'tennis' | 'lights' | 'result' | 'leaderboard') => void;
  onExitDevMode: () => void;
};

const DevMenu: React.FC<DevMenuProps> = ({ currentStep, onSelectTest, onExitDevMode }) => {
  return ( 
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      backgroundColor: '#111',
      padding: '12px 16px',
      borderRadius: '10px',
      color: 'white',
      zIndex: 1000,
      width: 160
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🛠 Dev Menu</h4>
      <p style={{ fontSize: '14px', margin: '4px 0' }}>Current: {currentStep}</p>
      <button onClick={() => onSelectTest('batak')} style={buttonStyle}>Batak</button>
      <button onClick={() => onSelectTest('tennis')} style={buttonStyle}>Tennis</button>
      <button onClick={() => onSelectTest('lights')} style={buttonStyle}>Lights Out</button>
      <button onClick={() => onSelectTest('result')} style={buttonStyle}>Result</button>
      <button onClick={() => onSelectTest('leaderboard')} style={buttonStyle}>Leaderboard</button>
      <hr style={{ margin: '10px 0' }} />
      <button onClick={onExitDevMode} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>
        Exit Dev Mode
      </button>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  margin: '4px 0',
  padding: '8px',
  fontSize: '14px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#333',
  color: 'white',
  cursor: 'pointer'
};

export default DevMenu;
