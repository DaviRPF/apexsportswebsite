# Apex Sports - Sistema de Gerenciamento de Treinos

Sistema completo para gerenciamento de treinos esportivos com chatbot WhatsApp integrado e interface React moderna.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express**
- **SQLite** (sql.js)
- **Baileys** (WhatsApp)
- **Google Gemini AI**
- **bcryptjs**

### Frontend
- **React 18**
- **Vite**
- **React Router**
- **CSS moderno com animações**

## 📋 Funcionalidades Implementadas

### ✅ Para Alunos
- Visualizar exercícios designados
- Marcar exercícios como concluídos
- Ver histórico de treinos
- **Calendário interativo** mostrando dias com treino
- Interface mobile-first responsiva

### ✅ Para Professores
- Designar exercícios para alunos
- Definir metas (tempo/repetições)
- Acompanhar progresso

### ✅ Para Professores ADM
- **Criar novos exercícios**
- Definir modalidade, fundamento, sub-fundamento
- Designar para alunos
- Gerenciar banco de exercícios

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
cd client && npm install && cd ..
```

### 2. Build do Frontend
```bash
npm run build
```

### 3. Iniciar Servidor
```bash
npm start
```

Acesse: **http://localhost:3000**

### Desenvolvimento (com hot reload)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Frontend dev: http://localhost:5173

## 👤 Login Padrão

- **Email**: admin@apex.com
- **Senha**: admin123
- **Tipo**: admin

⚠️ Altere a senha após primeiro login!

## 📱 Páginas Criadas

1. **/login** - Login com gradiente animado
2. **/aluno** - Exercícios, histórico, calendário
3. **/professor** - Designar exercícios
4. **/professor-adm** - Criar e designar exercícios

## 🎨 Design Highlights

- ✨ Animações suaves
- 📱 Mobile-first
- 🎨 Gradientes modernos
- 🌈 Componentes reutilizáveis
- ⚡ Performance otimizada

## 📦 Estrutura do Projeto

```
apexsportswebsite/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas principais
│   │   ├── hooks/           # Custom hooks
│   │   └── styles/          # CSS global
│   └── package.json
├── src/                     # Backend
│   ├── database.js          # Funções do banco
│   ├── server.js            # API Express
│   ├── whatsapp.js          # Integração WhatsApp
│   └── public/              # Build do React
└── package.json
```

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env`:

```env
GEMINI_API_KEY=sua_chave_api_aqui
SESSION_SECRET=seu_secret_aqui
PORT=3000
```

## 🎯 Pronto para Usar!

O sistema está completamente funcional e pronto para uso em produção! 🚀
