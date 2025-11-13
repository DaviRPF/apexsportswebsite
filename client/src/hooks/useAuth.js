import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (requiredTypes = []) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        navigate('/login');
        return;
      }

      const userData = await response.json();

      // Verificar se o tipo de usuário é permitido
      if (requiredTypes.length > 0 && !requiredTypes.includes(userData.tipo)) {
        alert('Acesso negado');
        navigate('/login');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading };
};
