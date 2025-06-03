import { createContext, useState, useEffect, useContext } from 'react';

// Criação do contexto
const ThemeContext = createContext();

// Hook personalizado para usar o tema
export const useTheme = () => useContext(ThemeContext);

// Provider do tema
export const ThemeProvider = ({ children }) => {
  // Verifica se há uma preferência salva no localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Verifica preferência do sistema se não houver tema salvo
    if (savedTheme) {
      return savedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Alterna entre os temas
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Atualiza o localStorage e o atributo data-theme no HTML quando o tema muda
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [darkMode]);

  // Valores disponibilizados pelo contexto
  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
