# Guia de Instalação - Apex Sports Chatbot

## Banco de Dados SQL Verdadeiro!

Agora o projeto usa **sql.js** - um SQLite verdadeiro compilado para WebAssembly.

### Vantagens:
✅ **Não precisa** de Visual Studio Build Tools
✅ **Não precisa** de Python
✅ **Banco SQL completo** com transações e integridade
✅ **Sem race conditions** - operações concorrentes seguras
✅ **Instalação rápida** sem compilação nativa
✅ Funciona em **qualquer Windows** sem configuração extra

## Instalação

### 1. Limpe instalações anteriores

```bash
# Remova node_modules (se existir)
rmdir /s /q node_modules

# Remova package-lock.json (se existir)
del package-lock.json

# Limpe o cache do npm
npm cache clean --force
```

### 2. Instale as dependências

```bash
npm install
```

Deve instalar sem erros agora! O sql.js é um pacote JavaScript puro.

### 3. Configure a API do Gemini

Crie um arquivo `.env` na raiz do projeto:

```
GEMINI_API_KEY=sua_chave_api_aqui
PORT=3000
```

**Obtenha sua chave em:** https://makersuite.google.com/app/apikey

### 4. Inicie o sistema

```bash
npm start
```

### 5. Acesse o painel

Abra o navegador em: **http://localhost:3000**

## Banco de Dados SQLite

O banco de dados agora é um arquivo SQLite em `data/apex.db`:

- **Transações atômicas** - operações seguras
- **Integridade referencial** - foreign keys funcionam
- **Concorrência adequada** - múltiplas operações simultâneas
- **Queries SQL completas** - JOIN, GROUP BY, etc.
- **Backup fácil** - copie o arquivo .db

### Fazer Backup

```bash
# Copiar o banco
copy data\apex.db backup-apex.db

# Restaurar o banco
copy backup-apex.db data\apex.db
```

## Estrutura do Banco

```
config_escola    → Configurações da escola
esportes         → Esportes disponíveis
turmas           → Turmas e horários
leads            → Contatos capturados
agendamentos     → Aulas experimentais agendadas
conversas        → Histórico de conversas
```

## Próximos Passos

1. ✅ Instale com `npm install`
2. ✅ Configure o `.env` com sua API Key do Gemini
3. ✅ Execute com `npm start`
4. ✅ Acesse http://localhost:3000
5. ✅ Escaneie o QR Code para conectar WhatsApp
6. ✅ Configure informações da escola
7. ✅ Cadastre esportes e turmas
8. ✅ Pronto! Bot funcionando

## Desenvolvimento

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## Resolução de Problemas

### Erro "Cannot find module"
```bash
npm cache clean --force
npm install
```

### QR Code não aparece
- Aguarde alguns segundos
- Recarregue a página
- Verifique se já não está conectado

### Bot não responde
- Verifique se a GEMINI_API_KEY está correta no .env
- Verifique os logs no terminal
- Certifique-se de que o WhatsApp está conectado (status "Conectado" no painel)

### Banco de dados corrompido
```bash
# Deletar e recriar
rmdir /s /q data
npm start
```

## Requisitos do Sistema

- **Node.js** versão 16 ou superior
- **Windows, Linux ou macOS**
- **4GB RAM** mínimo
- **Conexão com internet**

Verifique sua versão do Node:
```bash
node --version
```

Se for menor que v16, atualize em: https://nodejs.org/

## Diferenças Técnicas

### Por que sql.js?

**sql.js** é o SQLite oficial compilado para WebAssembly usando Emscripten:

- ✅ **SQLite completo** - mesmas funcionalidades do SQLite nativo
- ✅ **Zero dependências** nativas - JavaScript puro
- ✅ **Multiplataforma** - funciona em qualquer OS
- ✅ **Performance** - WebAssembly é muito rápido
- ✅ **Seguro** - transações ACID, sem race conditions

### Comparação:

| Recurso | sql.js | better-sqlite3 | JSON |
|---------|--------|----------------|------|
| Precisa compilar? | ❌ Não | ✅ Sim | ❌ Não |
| SQL completo? | ✅ Sim | ✅ Sim | ❌ Não |
| Transações? | ✅ Sim | ✅ Sim | ❌ Não |
| Race conditions? | ❌ Não | ❌ Não | ✅ Sim |
| Performance | 🟢 Boa | 🟢 Excelente | 🟡 OK |

## Suporte

Se tiver problemas:

1. Verifique se Node.js está atualizado
2. Delete `node_modules` e reinstale
3. Verifique se a porta 3000 está livre
4. Confira os logs no terminal

---

Feito com ❤️ para Apex Sports
