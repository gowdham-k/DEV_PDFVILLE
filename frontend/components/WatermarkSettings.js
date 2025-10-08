import { useCallback } from 'react';
import theme from '../styles/theme';

/**
 * Reusable component for watermark settings controls
 * @param {Object} props Component props
 * @param {Object} props.settings Current watermark settings
 * @param {Function} props.updateSetting Function to update a specific setting
 */
const WatermarkSettings = ({ settings, updateSetting }) => {
  // Handle input changes with appropriate type conversion
  const handleChange = useCallback((key, value, type = 'string') => {
    let processedValue = value;
    
    if (type === 'number') {
      processedValue = parseInt(value, 10);
    } else if (type === 'float') {
      processedValue = parseFloat(value);
    }
    
    updateSetting(key, processedValue);
  }, [updateSetting]);

  const styles = {
    watermarkSettings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: theme.spacing.lg,
      marginTop: theme.spacing.lg
    },
    settingGroup: {
      background: theme.colors.background.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.light}`
    },
    settingLabel: {
      display: 'block',
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm
    },
    input: {
      width: '100%',
      padding: theme.spacing.md,
      border: `2px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      background: theme.colors.background.light,
      transition: `border-color ${theme.transitions.fast}`
    },
    select: {
      width: '100%',
      padding: theme.spacing.md,
      border: `2px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text.primary,
      background: theme.colors.background.light,
      cursor: 'pointer'
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md
    },
    rangeInput: {
      flex: 1,
      height: '8px',
      borderRadius: theme.borderRadius.sm,
      background: theme.colors.border.light,
      outline: 'none',
      cursor: 'pointer'
    },
    rangeValue: {
      minWidth: '50px',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      background: theme.colors.text.secondary,
      color: 'white',
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: 'center'
    },
    colorInput: {
      width: '100%',
      height: '50px',
      border: `2px solid ${theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      background: 'none'
    }
  };

  return (
    <div style={styles.watermarkSettings}>
      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Watermark Text</label>
        <input
          type="text"
          value={settings.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter watermark text"
          style={styles.input}
        />
      </div>

      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Position</label>
        <select
          value={settings.position}
          onChange={(e) => handleChange('position', e.target.value)}
          style={styles.select}
        >
          <option value="center">Center</option>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Opacity: {Math.round(settings.opacity * 100)}%</label>
        <div style={styles.rangeContainer}>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.opacity}
            onChange={(e) => handleChange('opacity', e.target.value, 'float')}
            style={styles.rangeInput}
          />
          <div style={styles.rangeValue}>{Math.round(settings.opacity * 100)}%</div>
        </div>
      </div>

      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Rotation: {settings.rotation}°</label>
        <div style={styles.rangeContainer}>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={settings.rotation}
            onChange={(e) => handleChange('rotation', e.target.value, 'number')}
            style={styles.rangeInput}
          />
          <div style={styles.rangeValue}>{settings.rotation}°</div>
        </div>
      </div>

      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Font Size: {settings.fontSize}px</label>
        <div style={styles.rangeContainer}>
          <input
            type="range"
            min="12"
            max="120"
            step="6"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value, 'number')}
            style={styles.rangeInput}
          />
          <div style={styles.rangeValue}>{settings.fontSize}px</div>
        </div>
      </div>

      <div style={styles.settingGroup}>
        <label style={styles.settingLabel}>Color</label>
        <input
          type="color"
          value={settings.color}
          onChange={(e) => handleChange('color', e.target.value)}
          style={styles.colorInput}
        />
      </div>
    </div>
  );
};

export default WatermarkSettings;