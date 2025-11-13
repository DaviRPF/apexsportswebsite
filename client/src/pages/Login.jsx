import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está logado
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        redirectByRole(user.tipo);
      }
    } catch (error) {
      // Não está logado, continuar na tela de login
    }
  };

  const redirectByRole = (tipo) => {
    const routes = {
      aluno: '/aluno',
      professor: '/professor',
      professoradm: '/professor-adm',
      admin: '/professor-adm',
      atendente: '/professor-adm'
    };
    navigate(routes[tipo] || '/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Redirecionar baseado no tipo de usuário
      redirectByRole(data.usuario.tipo);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-container scale-in">
        <div className="login-header">
          <div className="login-icon">⚡</div>
          <h1 className="login-title">Apex Sports</h1>
          <p className="login-subtitle">Sistema de Gerenciamento de Treinos</p>
        </div>

        {error && <Alert variant="error" onClose={() => setError('')}>{error}</Alert>}

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<span>📧</span>}
          />

          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            icon={<span>🔒</span>}
          />

          <Button type="submit" loading={loading} fullWidth>
            Entrar
          </Button>
        </form>

        <div className="login-footer">
          <p>© 2024 Apex Sports - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
