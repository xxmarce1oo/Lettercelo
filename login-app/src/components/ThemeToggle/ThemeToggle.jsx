import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
