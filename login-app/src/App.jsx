import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import MovieLibrary from './components/MovieLibrary/MovieLibrary';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verifica se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Funções de autenticação (simuladas)
  const handleLogin = (email, password) => {
    // Aqui você implementaria a lógica real de autenticação
    console.log('Login com:', email, password);
    // Simula login bem-sucedido
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    window.location.href = '/movies';
  };

  const handleSignup = (userData) => {
    // Aqui você implementaria a lógica real de cadastro
    console.log('Cadastro com:', userData);
    // Simula cadastro bem-sucedido
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', userData.email);
    setIsAuthenticated(true);
    window.location.href = '/movies';
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? "/movies" : "/login"} />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/movies" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/movies" /> : <Signup onSignup={handleSignup} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/movies" element={isAuthenticated ? <MovieLibrary /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
