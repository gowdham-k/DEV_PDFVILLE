import React from 'react';

const LoadingSpinner = ({ size = 24, color = 'white', className = '' }) => {
  const styles = {
    spinner: {
      width: `${size}px`,
      height: `${size}px`,
      border: `3px solid rgba(${color === 'white' ? '255, 255, 255' : '51, 51, 51'}, 0.3)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '12px'
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner { animation: spin 1s linear infinite; }
      `}</style>
      <div style={styles.spinner} className={`spinner ${className}`}></div>
    </>
  );
};

export default LoadingSpinner;