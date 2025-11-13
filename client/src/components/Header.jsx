import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      navigate('/login');
    }
  };

  const getRoleLabel = (tipo) => {
    const labels = {
      admin: 'Administrador',
      professoradm: 'Professor ADM',
      professor: 'Professor',
      aluno: 'Aluno',
      atendente: 'Atendente'
    };
    return labels[tipo] || tipo;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-icon">⚡</div>
          <div>
            <h1 className="brand-title">Apex Sports</h1>
            <p className="brand-subtitle">{getRoleLabel(user?.tipo)}</p>
          </div>
        </div>

        <div className="header-user">
          <div className="user-avatar">{user?.nome?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{user?.nome}</p>
            <button className="btn-logout" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
