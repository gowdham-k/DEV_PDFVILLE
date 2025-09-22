import React from 'react';

const Button = ({ 
  onClick, 
  children, 
  disabled = false, 
  type = 'primary', 
  fullWidth = false,
  className = ''
}) => {
  const getStyles = () => {
    const baseStyles = {
      padding: '16px 32px',
      borderRadius: '16px',
      border: 'none',
      fontSize: '18px',
      fontWeight: '700',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.7 : 1
    };

    const typeStyles = {
      primary: {
        color: 'white',
        background: disabled ? '#ccc' : 'linear-gradient(135deg, #666666 0%, #333333 100%)',
        boxShadow: disabled ? 'none' : '0 10px 30px rgba(102, 102, 102, 0.4)'
      },
      secondary: {
        color: '#333333',
        background: '#f0f0f0',
        border: '2px solid #666666'
      },
      danger: {
        color: 'white',
        background: disabled ? '#ccc' : 'linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)',
        boxShadow: disabled ? 'none' : '0 10px 30px rgba(204, 0, 0, 0.4)'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      style={getStyles()} 
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;