import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input, { Select, Textarea } from '../components/Input';
import Alert from '../components/Alert';
import Loading from '../components/Loading';
import ImageUpload from '../components/ImageUpload';
import './ProfessorPage.css';

const ProfessorAdmPage = () => {
  const { user, loading: authLoading } = useAuth(['professoradm', 'admin']);
  const [activeTab, setActiveTab] = useState('exercicios');
  const [exercicios, setExercicios] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [designados, setDesignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form states
  const [formExercicio, setFormExercicio] = useState({
    nome: '',
    descricao: '',
    modalidade: '',
    fundamento: '',
    sub_fundamento: ''
  });

  const [formDesignar, setFormDesignar] = useState({
    aluno_id: '',
    exercicio_id: '',
    tipo_orientacao: '',
    valor_orientacao: ''
  });

  const [formAluno, setFormAluno] = useState({
    nome: '',
    email: '',
    senha: '',
    foto_perfil: null
  });

  useEffect(() => {
    if (user) {
      carregarExercicios();
      carregarAlunos();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'designar') {
      carregarDesignados();
    }
    if (user && activeTab === 'alunos') {
      carregarAlunos();
    }
  }, [user, activeTab]);

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

  const criarExercicio = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/exercicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formExercicio)
      });

      if (!response.ok) throw new Error('Erro ao criar exercício');

      showAlert('Exercício criado com sucesso! ✅', 'success');
      setFormExercicio({ nome: '', descricao: '', modalidade: '', fundamento: '', sub_fundamento: '' });
      carregarExercicios();
    } catch (error) {
      showAlert(error.message, 'error');
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

  const deletarExercicio = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

    try {
      const response = await fetch(`/api/exercicios/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir exercício');

      showAlert('Exercício excluído com sucesso!', 'success');
      carregarExercicios();
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

  const criarAluno = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formAluno,
          tipo: 'aluno'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar aluno');
      }

      const result = await response.json();

      // Se tem foto, atualizar
      if (formAluno.foto_perfil) {
        await fetch(`/api/usuarios/${result.id}/foto`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ foto: formAluno.foto_perfil })
        });
      }

      showAlert('Aluno criado com sucesso! ✅', 'success');
      setFormAluno({ nome: '', email: '', senha: '', foto_perfil: null });
      carregarAlunos();
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

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'exercicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercicios')}
        >
          <span>💪</span> Exercícios
        </button>
        <button
          className={`tab ${activeTab === 'designar' ? 'active' : ''}`}
          onClick={() => setActiveTab('designar')}
        >
          <span>📋</span> Designar
        </button>
        <button
          className={`tab ${activeTab === 'alunos' ? 'active' : ''}`}
          onClick={() => setActiveTab('alunos')}
        >
          <span>👨‍🎓</span> Alunos
        </button>
      </div>

      <div className="container">
        {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)}>{alert.message}</Alert>}

        {/* Tab: Exercícios */}
        {activeTab === 'exercicios' && (
          <div className="tab-content fade-in">
            <Card title="Criar Novo Exercício">
              <form onSubmit={criarExercicio}>
                <Input
                  label="Nome do Exercício *"
                  value={formExercicio.nome}
                  onChange={(e) => setFormExercicio({ ...formExercicio, nome: e.target.value })}
                  placeholder="Ex: Agachamento livre"
                  required
                />

                <Textarea
                  label="Descrição"
                  value={formExercicio.descricao}
                  onChange={(e) => setFormExercicio({ ...formExercicio, descricao: e.target.value })}
                  placeholder="Descreva o exercício..."
                />

                <div className="form-row">
                  <Input
                    label="Modalidade (Esporte) *"
                    value={formExercicio.modalidade}
                    onChange={(e) => setFormExercicio({ ...formExercicio, modalidade: e.target.value })}
                    placeholder="Ex: Futebol, Vôlei..."
                    required
                  />

                  <Input
                    label="Fundamento *"
                    value={formExercicio.fundamento}
                    onChange={(e) => setFormExercicio({ ...formExercicio, fundamento: e.target.value })}
                    placeholder="Ex: Força, Resistência..."
                    required
                  />
                </div>

                <Input
                  label="Sub-fundamento"
                  value={formExercicio.sub_fundamento}
                  onChange={(e) => setFormExercicio({ ...formExercicio, sub_fundamento: e.target.value })}
                  placeholder="Ex: Pernas, Core..."
                />

                <Button type="submit" fullWidth>
                  Criar Exercício
                </Button>
              </form>
            </Card>

            <Card title="Exercícios Cadastrados">
              {loading ? (
                <Loading />
              ) : exercicios.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💪</div>
                  <p>Nenhum exercício cadastrado ainda.</p>
                </div>
              ) : (
                <div className="exercicios-lista">
                  {exercicios.map((ex) => (
                    <div key={ex.id} className="exercicio-item">
                      <div>
                        <h4>{ex.nome}</h4>
                        <p>{ex.descricao || 'Sem descrição'}</p>
                        <div className="exercicio-tags">
                          <Badge variant="primary">{ex.modalidade}</Badge>
                          <Badge variant="info">{ex.fundamento}</Badge>
                          {ex.sub_fundamento && <Badge>{ex.sub_fundamento}</Badge>}
                        </div>
                        <small>Criado por: {ex.criador_nome}</small>
                      </div>
                      <div className="exercicio-actions">
                        <Button variant="danger" size="sm" onClick={() => deletarExercicio(ex.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab: Designar */}
        {activeTab === 'designar' && (
          <div className="tab-content fade-in">
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

            <Card title="Exercícios Designados">
              {designados.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>Nenhum exercício designado ainda.</p>
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
        )}

        {/* Tab: Alunos */}
        {activeTab === 'alunos' && (
          <div className="tab-content fade-in">
            <Card title="Criar Novo Aluno">
              <form onSubmit={criarAluno}>
                <ImageUpload
                  currentImage={formAluno.foto_perfil}
                  onImageChange={(foto) => setFormAluno({ ...formAluno, foto_perfil: foto })}
                  label="Foto do Aluno (Opcional)"
                />

                <Input
                  label="Nome Completo *"
                  value={formAluno.nome}
                  onChange={(e) => setFormAluno({ ...formAluno, nome: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />

                <Input
                  type="email"
                  label="Email *"
                  value={formAluno.email}
                  onChange={(e) => setFormAluno({ ...formAluno, email: e.target.value })}
                  placeholder="aluno@email.com"
                  required
                />

                <Input
                  type="password"
                  label="Senha *"
                  value={formAluno.senha}
                  onChange={(e) => setFormAluno({ ...formAluno, senha: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />

                <Button type="submit" variant="success" fullWidth>
                  Criar Aluno
                </Button>
              </form>
            </Card>

            <Card title="Alunos Cadastrados">
              {alunos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👨‍🎓</div>
                  <p>Nenhum aluno cadastrado ainda.</p>
                </div>
              ) : (
                <div className="exercicios-lista">
                  {alunos.map((aluno) => (
                    <div key={aluno.id} className="exercicio-item aluno-item">
                      <div className="aluno-info">
                        <div className="aluno-avatar">
                          {aluno.foto_perfil ? (
                            <img src={aluno.foto_perfil} alt={aluno.nome} />
                          ) : (
                            <span>{aluno.nome?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h4>{aluno.nome}</h4>
                          <p>{aluno.email}</p>
                          <Badge variant="info">Aluno</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorAdmPage;
