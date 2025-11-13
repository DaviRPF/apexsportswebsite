import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', 'data');
const DB_FILE = join(DATA_DIR, 'apex.db');

let db = null;
let SQL = null;

// Inicializar banco de dados
async function initDB() {
  SQL = await initSqlJs();

  // Criar diretório de dados se não existir
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // Carregar banco existente ou criar novo
  if (existsSync(DB_FILE)) {
    const buffer = readFileSync(DB_FILE);
    db = new SQL.Database(buffer);
    // Verificar e criar tabelas que não existem
    createTables();
    saveDB();
  } else {
    db = new SQL.Database();
    createTables();
    saveDB();
  }
}

// Salvar banco de dados no disco
function saveDB() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  writeFileSync(DB_FILE, buffer);
}

// Criar tabelas
function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS config_escola (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chave TEXT UNIQUE NOT NULL,
      valor TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS esportes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      ativo INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS turmas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      esporte_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      dia_semana TEXT NOT NULL,
      horario TEXT NOT NULL,
      vagas_disponiveis INTEGER DEFAULT 10,
      ativo INTEGER DEFAULT 1,
      FOREIGN KEY (esporte_id) REFERENCES esportes(id)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telefone TEXT UNIQUE NOT NULL,
      nome TEXT,
      nome_filho TEXT,
      para_quem TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER NOT NULL,
      turma_id INTEGER NOT NULL,
      data_aula TEXT NOT NULL,
      horario TEXT NOT NULL,
      status TEXT DEFAULT 'pendente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id),
      FOREIGN KEY (turma_id) REFERENCES turmas(id)
    );

    CREATE TABLE IF NOT EXISTS conversas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telefone TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      role TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('aluno', 'professor', 'atendente', 'admin')),
      ativo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Funções de configuração da escola
export const getConfig = (chave) => {
  const stmt = db.prepare('SELECT valor FROM config_escola WHERE chave = ?');
  stmt.bind([chave]);

  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject().valor;
  }
  stmt.free();

  return result;
};

export const setConfig = (chave, valor) => {
  db.run(
    'INSERT OR REPLACE INTO config_escola (chave, valor) VALUES (?, ?)',
    [chave, valor]
  );
  saveDB();
};

export const getAllConfig = () => {
  const stmt = db.prepare('SELECT chave, valor FROM config_escola');
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

// Funções de esportes
export const getEsportes = () => {
  const stmt = db.prepare('SELECT * FROM esportes WHERE ativo = 1');
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

export const addEsporte = (nome, descricao) => {
  db.run('INSERT INTO esportes (nome, descricao) VALUES (?, ?)', [nome, descricao]);
  saveDB();

  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const id = stmt.getAsObject().id;
  stmt.free();

  return { lastInsertRowid: id };
};

export const updateEsporte = (id, nome, descricao) => {
  db.run('UPDATE esportes SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, id]);
  saveDB();
};

export const deleteEsporte = (id) => {
  db.run('UPDATE esportes SET ativo = 0 WHERE id = ?', [id]);
  saveDB();
};

// Funções de turmas
export const getTurmas = () => {
  const stmt = db.prepare(`
    SELECT t.*, e.nome as esporte_nome
    FROM turmas t
    JOIN esportes e ON t.esporte_id = e.id
    WHERE t.ativo = 1
  `);
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

export const addTurma = (esporte_id, nome, dia_semana, horario, vagas_disponiveis) => {
  db.run(
    'INSERT INTO turmas (esporte_id, nome, dia_semana, horario, vagas_disponiveis) VALUES (?, ?, ?, ?, ?)',
    [esporte_id, nome, dia_semana, horario, vagas_disponiveis]
  );
  saveDB();

  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const id = stmt.getAsObject().id;
  stmt.free();

  return { lastInsertRowid: id };
};

export const updateTurma = (id, esporte_id, nome, dia_semana, horario, vagas_disponiveis) => {
  db.run(
    'UPDATE turmas SET esporte_id = ?, nome = ?, dia_semana = ?, horario = ?, vagas_disponiveis = ? WHERE id = ?',
    [esporte_id, nome, dia_semana, horario, vagas_disponiveis, id]
  );
  saveDB();
};

export const deleteTurma = (id) => {
  db.run('UPDATE turmas SET ativo = 0 WHERE id = ?', [id]);
  saveDB();
};

// Funções de leads
export const getOrCreateLead = (telefone) => {
  let stmt = db.prepare('SELECT * FROM leads WHERE telefone = ?');
  stmt.bind([telefone]);

  let lead = null;
  if (stmt.step()) {
    lead = stmt.getAsObject();
  }
  stmt.free();

  if (!lead) {
    db.run('INSERT INTO leads (telefone) VALUES (?)', [telefone]);
    saveDB();

    stmt = db.prepare('SELECT * FROM leads WHERE telefone = ?');
    stmt.bind([telefone]);
    stmt.step();
    lead = stmt.getAsObject();
    stmt.free();
  }

  return lead;
};

export const updateLead = (telefone, dados) => {
  const fields = [];
  const values = [];

  if (dados.nome) {
    fields.push('nome = ?');
    values.push(dados.nome);
  }
  if (dados.nome_filho) {
    fields.push('nome_filho = ?');
    values.push(dados.nome_filho);
  }
  if (dados.para_quem) {
    fields.push('para_quem = ?');
    values.push(dados.para_quem);
  }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(telefone);

  db.run(`UPDATE leads SET ${fields.join(', ')} WHERE telefone = ?`, values);
  saveDB();
};

export const getAllLeads = () => {
  const stmt = db.prepare('SELECT * FROM leads ORDER BY created_at DESC');
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

export const deleteLead = (id) => {
  db.run('DELETE FROM leads WHERE id = ?', [id]);
  saveDB();
};

// Funções de agendamentos
export const createAgendamento = (telefone, turma_id, data_aula, horario) => {
  const lead = getOrCreateLead(telefone);

  db.run(
    "INSERT INTO agendamentos (lead_id, turma_id, data_aula, horario, status) VALUES (?, ?, ?, ?, 'confirmado')",
    [lead.id, turma_id, data_aula, horario]
  );
  saveDB();

  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const id = stmt.getAsObject().id;
  stmt.free();

  return { lastInsertRowid: id };
};

export const getAgendamentos = () => {
  const stmt = db.prepare(`
    SELECT a.*, l.nome, l.telefone, t.nome as turma_nome, e.nome as esporte_nome
    FROM agendamentos a
    JOIN leads l ON a.lead_id = l.id
    JOIN turmas t ON a.turma_id = t.id
    JOIN esportes e ON t.esporte_id = e.id
    ORDER BY a.created_at DESC
  `);
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

// Funções de conversas
export const saveMessage = (telefone, mensagem, role) => {
  db.run(
    'INSERT INTO conversas (telefone, mensagem, role) VALUES (?, ?, ?)',
    [telefone, mensagem, role]
  );
  saveDB();
};

export const getConversationHistory = (telefone, limit = 10) => {
  const stmt = db.prepare(`
    SELECT mensagem, role, timestamp
    FROM conversas
    WHERE telefone = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  stmt.bind([telefone, limit]);

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results.reverse();
};

export const clearOldConversations = (days = 30) => {
  db.run(
    "DELETE FROM conversas WHERE timestamp < datetime('now', '-' || ? || ' days')",
    [days]
  );
  saveDB();
};

export const clearConversationByPhone = (telefone) => {
  db.run('DELETE FROM conversas WHERE telefone = ?', [telefone]);
  saveDB();
  console.log(`🗑️  Histórico de conversa limpo para ${telefone}`);
};

export const getAllConversations = () => {
  const stmt = db.prepare(`
    SELECT telefone, COUNT(*) as total_mensagens, MAX(timestamp) as ultima_mensagem
    FROM conversas
    GROUP BY telefone
    ORDER BY ultima_mensagem DESC
  `);
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

// Funções de usuários
export const getUsuarioByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1');
  stmt.bind([email]);

  let usuario = null;
  if (stmt.step()) {
    usuario = stmt.getAsObject();
  }
  stmt.free();

  return usuario;
};

export const getUsuarioById = (id) => {
  const stmt = db.prepare('SELECT * FROM usuarios WHERE id = ? AND ativo = 1');
  stmt.bind([id]);

  let usuario = null;
  if (stmt.step()) {
    usuario = stmt.getAsObject();
  }
  stmt.free();

  return usuario;
};

export const getAllUsuarios = () => {
  const stmt = db.prepare('SELECT id, nome, email, tipo, ativo, created_at FROM usuarios ORDER BY created_at DESC');
  const results = [];

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();

  return results;
};

export const createUsuario = (nome, email, senhaHash, tipo) => {
  db.run(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, tipo]
  );
  saveDB();

  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const id = stmt.getAsObject().id;
  stmt.free();

  return { lastInsertRowid: id };
};

export const updateUsuario = (id, nome, email, tipo) => {
  db.run(
    "UPDATE usuarios SET nome = ?, email = ?, tipo = ?, updated_at = datetime('now') WHERE id = ?",
    [nome, email, tipo, id]
  );
  saveDB();
};

export const updateUsuarioSenha = (id, senhaHash) => {
  db.run(
    "UPDATE usuarios SET senha = ?, updated_at = datetime('now') WHERE id = ?",
    [senhaHash, id]
  );
  saveDB();
};

export const deleteUsuario = (id) => {
  db.run('UPDATE usuarios SET ativo = 0 WHERE id = ?', [id]);
  saveDB();
};

export const createDefaultAdmin = () => {
  // Verificar se já existe algum admin
  const stmt = db.prepare("SELECT COUNT(*) as count FROM usuarios WHERE tipo = 'admin' AND ativo = 1");
  stmt.step();
  const count = stmt.getAsObject().count;
  stmt.free();

  if (count === 0) {
    // Criar admin padrão
    const senhaHash = bcrypt.hashSync('admin123', 10);
    createUsuario('Administrador', 'admin@apex.com', senhaHash, 'admin');
    console.log('✅ Usuário admin padrão criado:');
    console.log('   Email: admin@apex.com');
    console.log('   Senha: admin123');
    console.log('   ⚠️  ALTERE A SENHA APÓS O PRIMEIRO LOGIN!');
  }
};

// Inicializar o banco ao importar o módulo
await initDB();
createDefaultAdmin();

export default db;
