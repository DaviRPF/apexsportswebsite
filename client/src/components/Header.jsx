import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <div className="header-user" ref={menuRef}>
          <div className="user-info-desktop">
            <p className="user-name">{user?.nome}</p>
            <p className="user-email">{user?.email}</p>
          </div>

          <div className="user-avatar-wrapper">
            <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
              {user?.foto_perfil ? (
                <img src={user.foto_perfil} alt={user.nome} className="avatar-image" />
              ) : (
                user?.nome?.charAt(0).toUpperCase()
              )}
            </div>

            {menuOpen && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <div className="menu-avatar">
                    {user?.foto_perfil ? (
                      <img src={user.foto_perfil} alt={user.nome} />
                    ) : (
                      user?.nome?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="menu-user-info">
                    <p className="menu-user-name">{user?.nome}</p>
                    <p className="menu-user-email">{user?.email}</p>
                    <span className="menu-user-role">{getRoleLabel(user?.tipo)}</span>
                  </div>
                </div>

                <div className="user-menu-divider"></div>

                <button className="menu-item" onClick={() => {
                  setMenuOpen(false);
                  navigate('/perfil');
                }}>
                  <span className="menu-icon">👤</span>
                  Meu Perfil
                </button>

                {(user?.tipo === 'admin' || user?.tipo === 'professoradm') && (
                  <button className="menu-item" onClick={() => {
                    setMenuOpen(false);
                    navigate('/professor-adm');
                  }}>
                    <span className="menu-icon">⚙️</span>
                    Configurações
                  </button>
                )}

                <div className="user-menu-divider"></div>

                <button className="menu-item menu-item-danger" onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}>
                  <span className="menu-icon">🚪</span>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
