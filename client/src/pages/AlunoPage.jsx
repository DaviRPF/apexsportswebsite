import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import './AlunoPage.css';

const AlunoPage = () => {
  const { user, loading: authLoading } = useAuth(['aluno']);
  const [activeTab, setActiveTab] = useState('exercicios');
  const [exercicios, setExercicios] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [calendarioData, setCalendarioData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'calendario') {
      carregarCalendario(selectedMonth);
    }
  }, [user, activeTab, selectedMonth]);

  const carregarDados = async () => {
    await Promise.all([carregarExercicios(), carregarHistorico()]);
  };

  const carregarExercicios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/meus-exercicios');
      if (!response.ok) throw new Error('Erro ao carregar exercícios');
      const data = await response.json();
      setExercicios(data);
    } catch (error) {
      console.error(error);
      showAlert('Erro ao carregar exercícios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const carregarHistorico = async () => {
    try {
      const response = await fetch('/api/meu-historico');
      if (!response.ok) throw new Error('Erro ao carregar histórico');
      const data = await response.json();
      setHistorico(data);
    } catch (error) {
      console.error(error);
    }
  };

  const carregarCalendario = async (date) => {
    try {
      const ano = date.getFullYear();
      const mes = date.getMonth() + 1;
      const response = await fetch(`/api/meu-historico/${ano}/${mes}`);
      if (!response.ok) throw new Error('Erro ao carregar calendário');
      const data = await response.json();
      setCalendarioData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const concluirExercicio = async (exercicioId, tipo, valor) => {
    try {
      const response = await fetch('/api/concluir-exercicio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercicio_designado_id: exercicioId,
          tipo_realizado: tipo,
          valor_realizado: parseInt(valor)
        })
      });

      if (!response.ok) throw new Error('Erro ao concluir exercício');

      showAlert('Exercício concluído! Parabéns! 🎉', 'success');
      await carregarDados();
    } catch (error) {
      console.error(error);
      showAlert(error.message, 'error');
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 5000);
  };

  if (authLoading) return <Loading fullscreen />;

  return (
    <div className="aluno-page">
      <Header user={user} />

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'exercicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercicios')}
        >
          <span>💪</span> Meus Exercícios
        </button>
        <button
          className={`tab ${activeTab === 'historico' ? 'active' : ''}`}
          onClick={() => setActiveTab('historico')}
        >
          <span>📊</span> Histórico
        </button>
        <button
          className={`tab ${activeTab === 'calendario' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendario')}
        >
          <span>📅</span> Calendário
        </button>
      </div>

      <div className="container">
        {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)}>{alert.message}</Alert>}

        {/* Tab: Exercícios */}
        {activeTab === 'exercicios' && (
          <div className="tab-content fade-in">
            {loading ? (
              <Loading />
            ) : exercicios.length === 0 ? (
              <Card>
                <div className="empty-state">
                  <div className="empty-icon">🏃</div>
                  <h3>Nenhum exercício designado</h3>
                  <p>Seu professor ainda não designou exercícios para você.</p>
                </div>
              </Card>
            ) : (
              <div className="exercicios-grid">
                {exercicios.map((ex) => (
                  <ExercicioCard key={ex.id} exercicio={ex} onConcluir={concluirExercicio} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'historico' && (
          <div className="tab-content fade-in">
            <Card title="Histórico de Treinos">
              {historico.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📈</div>
                  <p>Você ainda não completou nenhum exercício.</p>
                </div>
              ) : (
                <div className="historico-lista">
                  {historico.map((h, index) => (
                    <HistoricoItem key={index} item={h} />
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab: Calendário */}
        {activeTab === 'calendario' && (
          <div className="tab-content fade-in">
            <Card title="Calendário de Treinos">
              <Calendario
                data={calendarioData}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Card de Exercício
const ExercicioCard = ({ exercicio, onConcluir }) => {
  const [showModal, setShowModal] = useState(false);
  const [valor, setValor] = useState('');

  const handleConcluir = () => {
    if (!valor || valor <= 0) {
      alert('Informe um valor válido');
      return;
    }
    onConcluir(exercicio.id, exercicio.tipo_orientacao || 'repeticao', valor);
    setShowModal(false);
    setValor('');
  };

  const isPendente = exercicio.status === 'pendente';

  return (
    <>
      <Card className={`exercicio-card ${!isPendente ? 'concluido' : ''}`}>
        <div className="exercicio-header-content">
          <h3 className="exercicio-nome">{exercicio.exercicio_nome}</h3>
          <Badge variant={isPendente ? 'warning' : 'success'}>
            {isPendente ? 'Pendente' : 'Concluído'}
          </Badge>
        </div>

        <p className="exercicio-descricao">{exercicio.exercicio_descricao || 'Sem descrição'}</p>

        <div className="exercicio-tags">
          <Badge variant="primary">{exercicio.modalidade}</Badge>
          <Badge variant="info">{exercicio.fundamento}</Badge>
          {exercicio.sub_fundamento && <Badge>{exercicio.sub_fundamento}</Badge>}
        </div>

        {exercicio.tipo_orientacao && (
          <div className="exercicio-orientacao">
            <strong>Meta:</strong> {exercicio.valor_orientacao}{' '}
            {exercicio.tipo_orientacao === 'tempo' ? 'minutos' : 'repetições'}
          </div>
        )}

        <div className="exercicio-footer">
          <small>Professor: {exercicio.professor_nome}</small>
          {isPendente && (
            <Button size="sm" variant="success" onClick={() => setShowModal(true)}>
              Marcar como feito
            </Button>
          )}
        </div>
      </Card>

      {/* Modal para concluir exercício */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal scale-in" onClick={(e) => e.stopPropagation()}>
            <h3>Concluir Exercício</h3>
            <p>{exercicio.exercicio_nome}</p>
            <Input
              type="number"
              label={`Quanto você fez? (${exercicio.tipo_orientacao === 'tempo' ? 'minutos' : 'repetições'})`}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="1"
              placeholder="Digite o valor"
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleConcluir}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Componente de Item do Histórico
const HistoricoItem = ({ item }) => {
  const data = new Date(item.data_conclusao);
  const dataFormatada = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="historico-item">
      <div className="historico-date">{dataFormatada}</div>
      <div className="historico-content">
        <h4>{item.exercicio_nome}</h4>
        <div className="historico-details">
          <Badge variant="primary">{item.modalidade}</Badge>
          <span>
            {item.valor_realizado} {item.tipo_realizado === 'tempo' ? 'min' : 'reps'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente de Calendário
const Calendario = ({ data, selectedMonth, onMonthChange }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);

  const diasComTreino = data.reduce((acc, item) => {
    const dia = new Date(item.data).getDate();
    acc[dia] = (acc[dia] || 0) + 1;
    return {};
  }, {});

  const previousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const mesAno = selectedMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="calendario">
      <div className="calendario-header">
        <Button size="sm" variant="ghost" onClick={previousMonth}>
          ←
        </Button>
        <h3>{mesAno}</h3>
        <Button size="sm" variant="ghost" onClick={nextMonth}>
          →
        </Button>
      </div>

      <div className="calendario-grid">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
          <div key={dia} className="calendario-dia-semana">
            {dia}
          </div>
        ))}

        {[...Array(startingDayOfWeek)].map((_, i) => (
          <div key={`empty-${i}`} className="calendario-dia empty"></div>
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const dia = i + 1;
          const temTreino = diasComTreino[dia];

          return (
            <div
              key={dia}
              className={`calendario-dia ${temTreino ? 'com-treino' : ''}`}
            >
              <span>{dia}</span>
              {temTreino && <div className="treino-indicator">{temTreino}</div>}
            </div>
          );
        })}
      </div>

      <div className="calendario-legenda">
        <div className="legenda-item">
          <div className="legenda-cor com-treino"></div>
          <span>Dias com treino</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-cor sem-treino"></div>
          <span>Dias sem treino</span>
        </div>
      </div>
    </div>
  );
};

export default AlunoPage;
