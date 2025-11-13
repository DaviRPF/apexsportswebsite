import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  getEsportes,
  addEsporte,
  updateEsporte,
  deleteEsporte,
  getTurmas,
  addTurma,
  updateTurma,
  deleteTurma,
  getConfig,
  setConfig,
  getAllLeads,
  deleteLead,
  getAgendamentos,
  clearConversationByPhone,
  getAllConversations,
  getUsuarioByEmail,
  getUsuarioById,
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  updateUsuarioSenha,
  deleteUsuario
} from './database.js';
import { getQRCode, getConnectionStatus } from './whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

// Configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'apex-sports-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    httpOnly: true,
    secure: false // Em produção com HTTPS, mudar para true
  }
}));

// Middleware de autenticação
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  next();
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const usuario = getUsuarioById(req.session.userId);
  if (!usuario || usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware para verificar permissões (admin ou atendente)
const requireAdminOrAtendente = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const usuario = getUsuarioById(req.session.userId);
  if (!usuario || (usuario.tipo !== 'admin' && usuario.tipo !== 'atendente')) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  next();
};

// Servir arquivos estáticos (apenas login.html será público)
app.use(express.static(join(__dirname, 'public')));

// ============================================
// ROTAS DE AUTENTICAÇÃO (SEM PROTEÇÃO)
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = getUsuarioByEmail(email);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criar sessão
    req.session.userId = usuario.id;
    req.session.userTipo = usuario.tipo;

    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ success: true });
  });
});

// Verificar sessão
app.get('/api/auth/me', requireAuth, (req, res) => {
  const usuario = getUsuarioById(req.session.userId);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo
  });
});

// ============================================
// ROTAS PROTEGIDAS
// ============================================

// Rota para verificar status da API Key
app.get('/api/status', requireAuth, (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'sua_chave_api_aqui' && apiKey.length > 10;

  res.json({
    apiKeyConfigured: hasValidApiKey,
    whatsappConnected: getConnectionStatus()
  });
});

// Rota para obter QR Code
app.get('/api/qrcode', requireAdminOrAtendente, (req, res) => {
  const qr = getQRCode();
  const connected = getConnectionStatus();
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'sua_chave_api_aqui' && apiKey.length > 10;

  res.json({
    qrCode: qr,
    connected: connected,
    apiKeyConfigured: hasValidApiKey
  });
});

// Rotas de configuração da escola
app.get('/api/config', requireAdminOrAtendente, (req, res) => {
  const infoEscola = getConfig('info_escola') || '';
  res.json({ info_escola: infoEscola });
});

app.post('/api/config', requireAdmin, (req, res) => {
  const { info_escola } = req.body;
  setConfig('info_escola', info_escola);
  res.json({ success: true });
});

// Rotas de esportes
app.get('/api/esportes', requireAuth, (req, res) => {
  res.json(getEsportes());
});

app.post('/api/esportes', requireAdmin, (req, res) => {
  const { nome, descricao } = req.body;
  const result = addEsporte(nome, descricao);
  res.json({ success: true, id: result.lastInsertRowid });
});

app.put('/api/esportes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  updateEsporte(id, nome, descricao);
  res.json({ success: true });
});

app.delete('/api/esportes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  deleteEsporte(id);
  res.json({ success: true });
});

// Rotas de turmas
app.get('/api/turmas', requireAuth, (req, res) => {
  res.json(getTurmas());
});

app.post('/api/turmas', requireAdminOrAtendente, (req, res) => {
  const { esporte_id, nome, dia_semana, horario, vagas_disponiveis } = req.body;
  const result = addTurma(esporte_id, nome, dia_semana, horario, vagas_disponiveis);
  res.json({ success: true, id: result.lastInsertRowid });
});

app.put('/api/turmas/:id', requireAdminOrAtendente, (req, res) => {
  const { id } = req.params;
  const { esporte_id, nome, dia_semana, horario, vagas_disponiveis } = req.body;
  updateTurma(id, esporte_id, nome, dia_semana, horario, vagas_disponiveis);
  res.json({ success: true });
});

app.delete('/api/turmas/:id', requireAdminOrAtendente, (req, res) => {
  const { id } = req.params;
  deleteTurma(id);
  res.json({ success: true });
});

// Rotas de leads e agendamentos
app.get('/api/leads', requireAdminOrAtendente, (req, res) => {
  res.json(getAllLeads());
});

app.delete('/api/leads/:id', requireAdminOrAtendente, (req, res) => {
  const { id } = req.params;
  deleteLead(id);
  res.json({ success: true });
});

app.get('/api/agendamentos', requireAdminOrAtendente, (req, res) => {
  res.json(getAgendamentos());
});

// Rotas de conversas
app.get('/api/conversas', requireAdminOrAtendente, (req, res) => {
  res.json(getAllConversations());
});

app.delete('/api/conversas/:telefone', requireAdminOrAtendente, (req, res) => {
  const { telefone } = req.params;
  clearConversationByPhone(telefone);
  res.json({ success: true, message: 'Histórico limpo com sucesso' });
});

// ============================================
// ROTAS DE GERENCIAMENTO DE USUÁRIOS (ADMIN)
// ============================================

app.get('/api/usuarios', requireAdmin, (req, res) => {
  res.json(getAllUsuarios());
});

app.post('/api/usuarios', requireAdmin, async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!['aluno', 'professor', 'atendente', 'admin'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    const result = createUsuario(nome, email, senhaHash, tipo);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.put('/api/usuarios/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, tipo } = req.body;

    if (!nome || !email || !tipo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!['aluno', 'professor', 'atendente', 'admin'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    updateUsuario(id, nome, email, tipo);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

app.put('/api/usuarios/:id/senha', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { senha } = req.body;

    if (!senha) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    updateUsuarioSenha(id, senhaHash);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

app.delete('/api/usuarios/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    deleteUsuario(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

export function startServer(port = 3000) {
  app.listen(port, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${port}`);
  });
}

export default app;
