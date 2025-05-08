import { useTheme } from './ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle-wrapper">
        <input 
          type="checkbox" 
          id="theme-toggle" 
          className="theme-toggle-input" 
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <label htmlFor="theme-toggle" className="theme-toggle-label">
          <span className="theme-toggle-inner">
            <span className="toggle-icon light-icon">☀️</span>
            <span className="toggle-icon dark-icon">🌙</span>
          </span>
          <span className="theme-toggle-switch"></span>
        </label>
      </div>
    </div>
  );
};

export default ThemeToggle;