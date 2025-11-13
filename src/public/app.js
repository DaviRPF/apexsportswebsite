// Variável global para armazenar usuário logado
let currentUser = null;

// Verificar autenticação
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
            // Não autenticado, redirecionar para login
            window.location.href = '/login.html';
            return false;
        }

        currentUser = await response.json();

        // Atualizar informações do usuário na tela
        document.getElementById('user-name').textContent = currentUser.nome;
        document.getElementById('user-tipo').textContent = currentUser.tipo;

        // Mostrar aba de usuários apenas para admin
        if (currentUser.tipo === 'admin') {
            document.getElementById('usuarios-tab-btn').style.display = 'block';
        }

        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = '/login.html';
        return false;
    }
}

// Função de logout
async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/login.html';
    }
}

// Controle de tabs
function showTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar tab selecionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Carregar dados da tab
    if (tabName === 'esportes') loadEsportes();
    if (tabName === 'turmas') loadTurmas();
    if (tabName === 'leads') loadLeads();
    if (tabName === 'agendamentos') loadAgendamentos();
    if (tabName === 'historicos') loadHistoricos();
    if (tabName === 'config') loadConfig();
    if (tabName === 'usuarios') loadUsuarios();
}

// Verificar QR Code
async function checkQRCode() {
    try {
        const response = await fetch('/api/qrcode');
        const data = await response.json();

        const qrcodeDiv = document.getElementById('qrcode');
        const statusDiv = document.getElementById('connection-status');

        // Verificar se API Key está configurada
        if (!data.apiKeyConfigured) {
            qrcodeDiv.innerHTML = `
                <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: left;">
                    <h3 style="color: #92400e; margin-bottom: 10px;">⚠️ API Key não configurada</h3>
                    <p style="color: #78350f; margin-bottom: 15px;">
                        O bot não poderá responder mensagens até você configurar a chave da API do Gemini.
                    </p>
                    <ol style="color: #78350f; margin-left: 20px; margin-bottom: 15px;">
                        <li>Acesse: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #667eea;">https://aistudio.google.com/app/apikey</a></li>
                        <li>Crie uma API Key (é grátis)</li>
                        <li>Edite o arquivo <code>.env</code> na raiz do projeto</li>
                        <li>Adicione: <code>GEMINI_API_KEY=sua_chave_aqui</code></li>
                        <li>Reinicie o bot</li>
                    </ol>
                </div>
            `;
            statusDiv.innerHTML = '<span class="status disconnected">API Key não configurada</span>';
            return;
        }

        if (data.connected) {
            qrcodeDiv.innerHTML = '<h3 style="color: #10b981;">✓ WhatsApp Conectado!</h3>';
            statusDiv.innerHTML = '<span class="status connected">Conectado</span>';
        } else if (data.qrCode) {
            qrcodeDiv.innerHTML = `<img src="https://api.qrserver.org/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.qrCode)}" alt="QR Code">`;
            statusDiv.innerHTML = '<span class="status disconnected">Aguardando conexão</span>';
        } else {
            qrcodeDiv.innerHTML = '<p>Aguardando QR Code...</p>';
            statusDiv.innerHTML = '<span class="status disconnected">Desconectado</span>';
        }
    } catch (error) {
        console.error('Erro ao verificar QR Code:', error);
    }
}

// Carregar configurações
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        document.getElementById('info_escola').value = data.info_escola || '';
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Salvar configurações
document.getElementById('config-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const info_escola = document.getElementById('info_escola').value;

    try {
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ info_escola })
        });

        showSuccess('config-success');
    } catch (error) {
        alert('Erro ao salvar configurações');
    }
});

// Carregar esportes
async function loadEsportes() {
    try {
        const response = await fetch('/api/esportes');
        const esportes = await response.json();

        const listDiv = document.getElementById('esportes-list');

        if (esportes.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhum esporte cadastrado ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${esportes.map(e => `
                        <tr>
                            <td>${e.nome}</td>
                            <td>${e.descricao || '-'}</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-small" onclick="deleteEsporte(${e.id})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Atualizar select de esportes
        const select = document.getElementById('turma_esporte');
        select.innerHTML = '<option value="">Selecione...</option>' +
            esportes.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    } catch (error) {
        console.error('Erro ao carregar esportes:', error);
    }
}

// Adicionar esporte
document.getElementById('esporte-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('esporte_nome').value;
    const descricao = document.getElementById('esporte_descricao').value;

    try {
        await fetch('/api/esportes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao })
        });

        document.getElementById('esporte-form').reset();
        showSuccess('esporte-success');
        loadEsportes();
    } catch (error) {
        alert('Erro ao adicionar esporte');
    }
});

// Deletar esporte
async function deleteEsporte(id) {
    if (!confirm('Tem certeza que deseja excluir este esporte?')) return;

    try {
        await fetch(`/api/esportes/${id}`, { method: 'DELETE' });
        showSuccess('esporte-success');
        loadEsportes();
    } catch (error) {
        alert('Erro ao excluir esporte');
    }
}

// Carregar turmas
async function loadTurmas() {
    try {
        const response = await fetch('/api/turmas');
        const turmas = await response.json();

        // Carregar esportes para o select
        const esportesResponse = await fetch('/api/esportes');
        const esportes = await esportesResponse.json();
        const select = document.getElementById('turma_esporte');
        select.innerHTML = '<option value="">Selecione...</option>' +
            esportes.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');

        const listDiv = document.getElementById('turmas-list');

        if (turmas.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhuma turma cadastrada ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Esporte</th>
                        <th>Nome</th>
                        <th>Dia</th>
                        <th>Horário</th>
                        <th>Vagas</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${turmas.map(t => `
                        <tr>
                            <td>${t.esporte_nome}</td>
                            <td>${t.nome}</td>
                            <td>${t.dia_semana}</td>
                            <td>${t.horario}</td>
                            <td>${t.vagas_disponiveis}</td>
                            <td class="actions">
                                <button class="btn btn-small" onclick="editTurma(${t.id}, '${t.esporte_id}', '${t.nome}', '${t.dia_semana}', '${t.horario}', ${t.vagas_disponiveis})" style="background: #667eea; color: white;">Editar</button>
                                <button class="btn btn-danger btn-small" onclick="deleteTurma(${t.id})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar turmas:', error);
    }
}

// Variável para controlar edição de turma
let turmaEditandoId = null;

// Adicionar ou atualizar turma
document.getElementById('turma-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const esporte_id = document.getElementById('turma_esporte').value;
    const nome = document.getElementById('turma_nome').value;
    const dia_semana = document.getElementById('turma_dia').value;
    const horario = document.getElementById('turma_horario').value;
    const vagas_disponiveis = document.getElementById('turma_vagas').value;

    try {
        if (turmaEditandoId) {
            // Atualizar turma existente
            await fetch(`/api/turmas/${turmaEditandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ esporte_id, nome, dia_semana, horario, vagas_disponiveis })
            });
            turmaEditandoId = null;

            // Resetar botão
            const submitBtn = document.querySelector('#turma-form button[type="submit"]');
            submitBtn.textContent = 'Adicionar Turma';
            submitBtn.style.background = '';
        } else {
            // Adicionar nova turma
            await fetch('/api/turmas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ esporte_id, nome, dia_semana, horario, vagas_disponiveis })
            });
        }

        document.getElementById('turma-form').reset();
        showSuccess('turma-success');
        loadTurmas();
    } catch (error) {
        alert('Erro ao salvar turma');
    }
});

// Editar turma
function editTurma(id, esporte_id, nome, dia_semana, horario, vagas_disponiveis) {
    turmaEditandoId = id;

    // Preencher o formulário
    document.getElementById('turma_esporte').value = esporte_id;
    document.getElementById('turma_nome').value = nome;
    document.getElementById('turma_dia').value = dia_semana;
    document.getElementById('turma_horario').value = horario;
    document.getElementById('turma_vagas').value = vagas_disponiveis;

    // Mudar texto do botão
    const submitBtn = document.querySelector('#turma-form button[type="submit"]');
    submitBtn.textContent = 'Atualizar Turma';
    submitBtn.style.background = '#f59e0b';

    // Scroll para o formulário
    document.getElementById('turma-form').scrollIntoView({ behavior: 'smooth' });
}

// Deletar turma
async function deleteTurma(id) {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) return;

    try {
        await fetch(`/api/turmas/${id}`, { method: 'DELETE' });
        showSuccess('turma-success');
        loadTurmas();
    } catch (error) {
        alert('Erro ao excluir turma');
    }
}

// Carregar leads
async function loadLeads() {
    try {
        const response = await fetch('/api/leads');
        const leads = await response.json();

        const listDiv = document.getElementById('leads-list');

        if (leads.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhum lead capturado ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Para Quem</th>
                        <th>Nome Filho</th>
                        <th>Data Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${leads.map(l => `
                        <tr>
                            <td>${l.nome || '-'}</td>
                            <td>${l.telefone}</td>
                            <td>${l.para_quem || '-'}</td>
                            <td>${l.nome_filho || '-'}</td>
                            <td>${new Date(l.created_at).toLocaleString('pt-BR')}</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-small" onclick="deleteLead('${l.id}')">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar leads:', error);
    }
}

// Carregar agendamentos
async function loadAgendamentos() {
    try {
        const response = await fetch('/api/agendamentos');
        const agendamentos = await response.json();

        const listDiv = document.getElementById('agendamentos-list');

        if (agendamentos.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhum agendamento realizado ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Esporte</th>
                        <th>Turma</th>
                        <th>Data Aula</th>
                        <th>Horário</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${agendamentos.map(a => `
                        <tr>
                            <td>${a.nome || '-'}</td>
                            <td>${a.telefone}</td>
                            <td>${a.esporte_nome}</td>
                            <td>${a.turma_nome}</td>
                            <td>${a.data_aula}</td>
                            <td>${a.horario}</td>
                            <td>${a.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Deletar lead
async function deleteLead(id) {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;

    try {
        await fetch(`/api/leads/${id}`, { method: 'DELETE' });
        loadLeads();
    } catch (error) {
        alert('Erro ao excluir lead');
    }
}

// Carregar históricos
async function loadHistoricos() {
    try {
        const response = await fetch('/api/conversas');
        const historicos = await response.json();

        const listDiv = document.getElementById('historicos-list');

        if (historicos.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhuma conversa registrada ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Telefone</th>
                        <th>Total de Mensagens</th>
                        <th>Última Mensagem</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${historicos.map(h => `
                        <tr>
                            <td>${h.telefone}</td>
                            <td>${h.total_mensagens}</td>
                            <td>${new Date(h.ultima_mensagem).toLocaleString('pt-BR')}</td>
                            <td class="actions">
                                <button class="btn btn-danger btn-small" onclick="deleteHistorico('${h.telefone}')">Limpar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar históricos:', error);
    }
}

// Deletar histórico
async function deleteHistorico(telefone) {
    if (!confirm('Tem certeza que deseja limpar o histórico de conversas deste número?')) return;

    try {
        await fetch(`/api/conversas/${telefone}`, { method: 'DELETE' });
        loadHistoricos();
    } catch (error) {
        alert('Erro ao limpar histórico');
    }
}

// Mostrar mensagem de sucesso
function showSuccess(id) {
    const msg = document.getElementById(id);
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3000);
}

// ============================================
// GERENCIAMENTO DE USUÁRIOS
// ============================================

// Carregar usuários
async function loadUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();

        const listDiv = document.getElementById('usuarios-list');

        if (usuarios.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Nenhum usuário cadastrado ainda</div>';
            return;
        }

        listDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Data Cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios.map(u => `
                        <tr>
                            <td>${u.nome}</td>
                            <td>${u.email}</td>
                            <td style="text-transform: capitalize;">${u.tipo}</td>
                            <td>${u.ativo ? '<span style="color: #10b981;">Ativo</span>' : '<span style="color: #ef4444;">Inativo</span>'}</td>
                            <td>${new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                            <td class="actions">
                                <button class="btn btn-small" onclick="editUsuario(${u.id}, '${u.nome}', '${u.email}', '${u.tipo}')" style="background: #667eea; color: white;">Editar</button>
                                <button class="btn btn-danger btn-small" onclick="deleteUsuario(${u.id})">Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Variável para controlar edição de usuário
let usuarioEditandoId = null;

// Adicionar ou atualizar usuário
document.getElementById('usuario-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('usuario_nome').value;
    const email = document.getElementById('usuario_email').value;
    const senha = document.getElementById('usuario_senha').value;
    const tipo = document.getElementById('usuario_tipo').value;

    try {
        if (usuarioEditandoId) {
            // Atualizar usuário existente (sem senha)
            await fetch(`/api/usuarios/${usuarioEditandoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, tipo })
            });

            // Se senha foi preenchida, atualizar separadamente
            if (senha) {
                await fetch(`/api/usuarios/${usuarioEditandoId}/senha`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ senha })
                });
            }

            usuarioEditandoId = null;

            // Resetar botão
            const submitBtn = document.querySelector('#usuario-form button[type="submit"]');
            submitBtn.textContent = 'Adicionar Usuário';
            submitBtn.style.background = '';

            // Resetar campo de senha para required
            document.getElementById('usuario_senha').required = true;
        } else {
            // Adicionar novo usuário
            await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, tipo })
            });
        }

        document.getElementById('usuario-form').reset();
        showSuccess('usuario-success');
        loadUsuarios();
    } catch (error) {
        alert('Erro ao salvar usuário');
    }
});

// Editar usuário
function editUsuario(id, nome, email, tipo) {
    usuarioEditandoId = id;

    // Preencher o formulário
    document.getElementById('usuario_nome').value = nome;
    document.getElementById('usuario_email').value = email;
    document.getElementById('usuario_tipo').value = tipo;
    document.getElementById('usuario_senha').value = '';
    document.getElementById('usuario_senha').required = false;
    document.getElementById('usuario_senha').placeholder = 'Deixe em branco para não alterar';

    // Mudar texto do botão
    const submitBtn = document.querySelector('#usuario-form button[type="submit"]');
    submitBtn.textContent = 'Atualizar Usuário';
    submitBtn.style.background = '#f59e0b';

    // Scroll para o formulário
    document.getElementById('usuario-form').scrollIntoView({ behavior: 'smooth' });
}

// Deletar usuário
async function deleteUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        showSuccess('usuario-success');
        loadUsuarios();
    } catch (error) {
        alert('Erro ao excluir usuário');
    }
}

// Inicializar
async function init() {
    // Verificar autenticação primeiro
    const isAuthenticated = await checkAuth();

    if (isAuthenticated) {
        checkQRCode();
        setInterval(checkQRCode, 3000);
        loadConfig();
    }
}

init();
