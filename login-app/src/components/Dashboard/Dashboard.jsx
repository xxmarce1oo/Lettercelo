import { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaBell, FaCog, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Simula carregamento de dados do usuário
  useEffect(() => {
    // Em um caso real, aqui você buscaria os dados do usuário de uma API
    setTimeout(() => {
      setUser({
        name: 'Usuário Demo',
        email: 'usuario@exemplo.com',
        lastLogin: new Date().toLocaleString('pt-BR'),
        notifications: 3
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // Em um caso real, aqui você faria o logout na API
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Login App</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <FaChartLine /> Dashboard
            </li>
            <li>
              <FaUser /> Perfil
            </li>
            <li>
              <FaBell /> Notificações
              {user.notifications > 0 && (
                <span className="notification-badge">{user.notifications}</span>
              )}
            </li>
            <li>
              <FaCog /> Configurações
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bem-vindo, {user.name}!</h1>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h3>Status da Conta</h3>
            <div className="card-content">
              <p><strong>Último acesso:</strong> {user.lastLogin}</p>
              <p><strong>Status:</strong> <span className="status-active">Ativo</span></p>
              <p><strong>Modo:</strong> {darkMode ? 'Escuro' : 'Claro'}</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Notificações</h3>
            <div className="card-content">
              {user.notifications > 0 ? (
                <p>Você tem {user.notifications} notificações não lidas.</p>
              ) : (
                <p>Você não tem notificações novas.</p>
              )}
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Informações da Conta</h3>
            <div className="card-content">
              <p>Esta é uma página de demonstração após o login bem-sucedido.</p>
              <p>Em uma aplicação real, aqui seriam exibidos dados relevantes do usuário e funcionalidades do sistema.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
