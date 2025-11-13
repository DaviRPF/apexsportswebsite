// Verificar autenticação
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      window.location.href = '/login.html';
      return null;
    }

    const user = await response.json();

    // Verificar se é professor ADM ou admin
    if (user.tipo !== 'professoradm' && user.tipo !== 'admin') {
      alert('Acesso negado. Apenas professores administradores.');
      logout();
      return null;
    }

    document.getElementById('user-name').textContent = user.nome;
    return user;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    window.location.href = '/login.html';
    return null;
  }
}

// Logout
async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
  window.location.href = '/login.html';
}

// Trocar aba
function switchTab(index) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('active');
      contents[i].classList.add('active');
    } else {
      tab.classList.remove('active');
      contents[i].classList.remove('active');
    }
  });

  // Carregar dados quando mudar para aba de designar
  if (index === 1) {
    carregarAlunos();
    carregarExerciciosDesignados();
  }
}

// Mostrar alerta
function showAlert(elementId, message, type = 'success') {
  const alert = document.getElementById(elementId);
  alert.className = `alert alert-${type} show`;
  alert.textContent = message;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

// ============================================
// EXERCÍCIOS
// ============================================

// Carregar exercícios
async function carregarExercicios() {
  const lista = document.getElementById('lista-exercicios');

  try {
    const response = await fetch('/api/exercicios');
    if (!response.ok) throw new Error('Erro ao carregar exercícios');

    const exercicios = await response.json();

    if (exercicios.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <p>Nenhum exercício cadastrado ainda.</p>
          <p>Crie seu primeiro exercício acima!</p>
        </div>
      `;
      return;
    }

    lista.innerHTML = exercicios.map(ex => `
      <div class="exercicio-item">
        <div class="exercicio-header">
          <div>
            <div class="exercicio-nome">${ex.nome}</div>
            <div class="exercicio-info">${ex.descricao || 'Sem descrição'}</div>
          </div>
        </div>
        <div>
          <span class="badge badge-primary">${ex.modalidade}</span>
          <span class="badge badge-success">${ex.fundamento}</span>
          ${ex.sub_fundamento ? `<span class="badge badge-success">${ex.sub_fundamento}</span>` : ''}
        </div>
        <div class="exercicio-info" style="margin-top: 0.5rem;">
          Criado por: ${ex.criador_nome}
        </div>
        <div class="exercicio-actions">
          <button class="btn btn-danger" onclick="deletarExercicio(${ex.id})">Excluir</button>
        </div>
      </div>
    `).join('');

    // Atualizar select de exercícios na aba de designar
    atualizarSelectExercicios(exercicios);

  } catch (error) {
    console.error('Erro ao carregar exercícios:', error);
    lista.innerHTML = '<div class="empty-state">Erro ao carregar exercícios.</div>';
  }
}

// Atualizar select de exercícios
function atualizarSelectExercicios(exercicios) {
  const select = document.getElementById('exercicio');
  select.innerHTML = '<option value="">Selecione um exercício</option>' +
    exercicios.map(ex => `
      <option value="${ex.id}">${ex.nome} - ${ex.modalidade} (${ex.fundamento})</option>
    `).join('');
}

// Criar exercício
document.getElementById('form-exercicio').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
    modalidade: formData.get('modalidade'),
    fundamento: formData.get('fundamento'),
    sub_fundamento: formData.get('sub_fundamento')
  };

  try {
    const response = await fetch('/api/exercicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar exercício');
    }

    showAlert('alert-exercicio', 'Exercício criado com sucesso!', 'success');
    e.target.reset();
    carregarExercicios();

  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    showAlert('alert-exercicio', error.message, 'error');
  }
});

// Deletar exercício
async function deletarExercicio(id) {
  if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

  try {
    const response = await fetch(`/api/exercicios/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao excluir exercício');

    showAlert('alert-exercicio', 'Exercício excluído com sucesso!', 'success');
    carregarExercicios();

  } catch (error) {
    console.error('Erro ao excluir exercício:', error);
    showAlert('alert-exercicio', 'Erro ao excluir exercício', 'error');
  }
}

// ============================================
// DESIGNAR EXERCÍCIOS
// ============================================

// Carregar alunos
async function carregarAlunos() {
  const select = document.getElementById('aluno');

  try {
    const response = await fetch('/api/alunos');
    if (!response.ok) throw new Error('Erro ao carregar alunos');

    const alunos = await response.json();

    if (alunos.length === 0) {
      select.innerHTML = '<option value="">Nenhum aluno cadastrado</option>';
      return;
    }

    select.innerHTML = '<option value="">Selecione um aluno</option>' +
      alunos.map(aluno => `
        <option value="${aluno.id}">${aluno.nome} (${aluno.email})</option>
      `).join('');

  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
    select.innerHTML = '<option value="">Erro ao carregar alunos</option>';
  }
}

// Designar exercício
document.getElementById('form-designar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    exercicio_id: parseInt(formData.get('exercicio')),
    aluno_id: parseInt(formData.get('aluno')),
    tipo_orientacao: formData.get('tipo_orientacao') || null,
    valor_orientacao: formData.get('valor_orientacao') ? parseInt(formData.get('valor_orientacao')) : null
  };

  // Validar que se tem tipo de orientação, tem que ter valor
  if (data.tipo_orientacao && !data.valor_orientacao) {
    showAlert('alert-designar', 'Informe o valor da orientação', 'error');
    return;
  }

  try {
    const response = await fetch('/api/exercicios-designados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao designar exercício');
    }

    showAlert('alert-designar', 'Exercício designado com sucesso!', 'success');
    e.target.reset();
    carregarExerciciosDesignados();

  } catch (error) {
    console.error('Erro ao designar exercício:', error);
    showAlert('alert-designar', error.message, 'error');
  }
});

// Carregar exercícios designados
async function carregarExerciciosDesignados() {
  const lista = document.getElementById('lista-designados');

  try {
    const response = await fetch('/api/exercicios-designados');
    if (!response.ok) throw new Error('Erro ao carregar designações');

    const designados = await response.json();

    if (designados.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <p>Nenhum exercício designado ainda.</p>
        </div>
      `;
      return;
    }

    lista.innerHTML = designados.map(d => {
      const orientacao = d.tipo_orientacao
        ? `${d.valor_orientacao} ${d.tipo_orientacao === 'tempo' ? 'minutos' : 'repetições'}`
        : 'Sem orientação específica';

      const statusBadge = d.status === 'concluido'
        ? '<span class="badge badge-success">Concluído</span>'
        : '<span class="badge badge-primary">Pendente</span>';

      return `
        <div class="exercicio-item">
          <div class="exercicio-header">
            <div>
              <div class="exercicio-nome">${d.exercicio_nome}</div>
              <div class="exercicio-info">Aluno: ${d.aluno_nome}</div>
              <div class="exercicio-info">Orientação: ${orientacao}</div>
            </div>
          </div>
          <div>
            <span class="badge badge-primary">${d.modalidade}</span>
            ${statusBadge}
          </div>
          <div class="exercicio-actions">
            <button class="btn btn-danger" onclick="deletarDesignacao(${d.id})">Remover</button>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Erro ao carregar designações:', error);
    lista.innerHTML = '<div class="empty-state">Erro ao carregar designações.</div>';
  }
}

// Deletar designação
async function deletarDesignacao(id) {
  if (!confirm('Tem certeza que deseja remover esta designação?')) return;

  try {
    const response = await fetch(`/api/exercicios-designados/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao remover designação');

    showAlert('alert-designar', 'Designação removida com sucesso!', 'success');
    carregarExerciciosDesignados();

  } catch (error) {
    console.error('Erro ao remover designação:', error);
    showAlert('alert-designar', 'Erro ao remover designação', 'error');
  }
}

// Inicialização
(async () => {
  const user = await checkAuth();
  if (user) {
    carregarExercicios();
  }
})();
