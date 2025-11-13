import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input, { Select } from '../components/Input';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import './ProfessorPage.css';

const ProfessorPage = () => {
  const { user, loading: authLoading } = useAuth(['professor', 'professoradm', 'admin']);
  const [exercicios, setExercicios] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [designados, setDesignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formDesignar, setFormDesignar] = useState({
    aluno_id: '',
    exercicio_id: '',
    tipo_orientacao: '',
    valor_orientacao: ''
  });

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    await Promise.all([carregarExercicios(), carregarAlunos(), carregarDesignados()]);
  };

  const carregarExercicios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exercicios');
      if (!response.ok) throw new Error('Erro ao carregar exercícios');
      const data = await response.json();
      setExercicios(data);
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarAlunos = async () => {
    try {
      const response = await fetch('/api/alunos');
      if (!response.ok) throw new Error('Erro ao carregar alunos');
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const carregarDesignados = async () => {
    try {
      const response = await fetch('/api/exercicios-designados');
      if (!response.ok) throw new Error('Erro ao carregar designações');
      const data = await response.json();
      setDesignados(data);
    } catch (error) {
      console.error(error);
    }
  };

  const designarExercicio = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/exercicios-designados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formDesignar,
          aluno_id: parseInt(formDesignar.aluno_id),
          exercicio_id: parseInt(formDesignar.exercicio_id),
          valor_orientacao: formDesignar.valor_orientacao ? parseInt(formDesignar.valor_orientacao) : null
        })
      });

      if (!response.ok) throw new Error('Erro ao designar exercício');

      showAlert('Exercício designado com sucesso! ✅', 'success');
      setFormDesignar({ aluno_id: '', exercicio_id: '', tipo_orientacao: '', valor_orientacao: '' });
      carregarDesignados();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  const deletarDesignacao = async (id) => {
    if (!confirm('Tem certeza que deseja remover esta designação?')) return;

    try {
      const response = await fetch(`/api/exercicios-designados/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao remover designação');

      showAlert('Designação removida com sucesso!', 'success');
      carregarDesignados();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 5000);
  };

  if (authLoading) return <Loading fullscreen />;

  return (
    <div className="professor-page">
      <Header user={user} />

      <div className="container">
        {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)}>{alert.message}</Alert>}

        <Card title="Designar Exercício para Aluno">
          <form onSubmit={designarExercicio}>
            <Select
              label="Aluno *"
              value={formDesignar.aluno_id}
              onChange={(e) => setFormDesignar({ ...formDesignar, aluno_id: e.target.value })}
              required
            >
              <option value="">Selecione um aluno</option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome} ({aluno.email})
                </option>
              ))}
            </Select>

            <Select
              label="Exercício *"
              value={formDesignar.exercicio_id}
              onChange={(e) => setFormDesignar({ ...formDesignar, exercicio_id: e.target.value })}
              required
            >
              <option value="">Selecione um exercício</option>
              {exercicios.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.nome} - {ex.modalidade}
                </option>
              ))}
            </Select>

            <div className="form-row">
              <Select
                label="Tipo de Orientação"
                value={formDesignar.tipo_orientacao}
                onChange={(e) => setFormDesignar({ ...formDesignar, tipo_orientacao: e.target.value })}
              >
                <option value="">Sem orientação específica</option>
                <option value="tempo">Tempo (minutos)</option>
                <option value="repeticao">Repetições</option>
              </Select>

              <Input
                type="number"
                label="Valor"
                value={formDesignar.valor_orientacao}
                onChange={(e) => setFormDesignar({ ...formDesignar, valor_orientacao: e.target.value })}
                placeholder="Ex: 10"
                min="1"
              />
            </div>

            <Button type="submit" variant="success" fullWidth>
              Designar Exercício
            </Button>
          </form>
        </Card>

        <Card title="Meus Exercícios Designados">
          {loading ? (
            <Loading />
          ) : designados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Você ainda não designou exercícios.</p>
            </div>
          ) : (
            <div className="exercicios-lista">
              {designados.map((d) => (
                <div key={d.id} className="exercicio-item">
                  <div>
                    <h4>{d.exercicio_nome}</h4>
                    <p>Aluno: {d.aluno_nome}</p>
                    {d.tipo_orientacao && (
                      <p>
                        Meta: {d.valor_orientacao}{' '}
                        {d.tipo_orientacao === 'tempo' ? 'minutos' : 'repetições'}
                      </p>
                    )}
                    <div className="exercicio-tags">
                      <Badge variant="primary">{d.modalidade}</Badge>
                      <Badge variant={d.status === 'concluido' ? 'success' : 'warning'}>
                        {d.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                  <div className="exercicio-actions">
                    <Button variant="danger" size="sm" onClick={() => deletarDesignacao(d.id)}>
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfessorPage;
