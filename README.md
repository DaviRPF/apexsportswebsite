# Apex Sports - Chatbot de Atendimento

Chatbot inteligente para WhatsApp usando Baileys e Google Gemini AI para agendamento de aulas experimentais na Apex Sports.

## Funcionalidades

- **WhatsApp Bot**: Atendimento automático via WhatsApp usando Baileys
- **IA Conversacional**: Powered by Google Gemini AI para conversas naturais
- **Gerenciamento de Leads**: Captura automática de informações dos clientes
- **Agendamento Inteligente**: Sistema automático de agendamento de aulas experimentais
- **Interface Web**: Painel de controle simples e intuitivo
- **Banco de Dados**: SQLite para armazenamento de todas as informações

## O que o bot faz?

1. **Conversa naturalmente** como um atendente humano (não é um formulário!)
2. **Pergunta o nome** do cliente de forma natural no início
3. **Apresenta os esportes** e turmas disponíveis conforme a conversa flui
4. **Identifica se a aula é** para o próprio cliente ou para filho(a)
5. **Captura múltiplos filhos** automaticamente (ex: Ana e Pedro)
6. **Ajuda a escolher** o melhor horário e dia
7. **Confirma o agendamento** da aula experimental
8. **Armazena todas as informações** no banco de dados automaticamente

## 🎯 Conversação Natural - Como Funciona

Este bot foi desenvolvido para **conversar de forma natural**, não como um formulário robotizado.

### Como o Bot Conversa

**❌ Não é assim (robotizado):**
```
Bot: Qual seu nome?
Você: Não sei ainda
Bot: Por favor, informe seu nome.
```

**✅ É assim (natural):**
```
Você: Oi, queria saber sobre aulas de vôlei
Bot: Oi! Que legal! Temos aulas de vôlei sim 😊 E qual é o seu nome?
Você: Quais os horários?
Bot: Temos terça e quinta às 18h. E você, como se chama? 😊
```

### Captura Inteligente de Informações

O bot **extrai informações automaticamente** durante a conversa:

**Exemplos:**
- "Sou o Davi" → Captura: `nome = "Davi"`
- "É pro meu filho Pedro" → Captura: `para_quem = "filho"`, `nome_filho = "Pedro"`
- "Ana e Pedro" → Captura múltiplos: `"Ana, Pedro"`

### Múltiplos Filhos

O bot identifica quando há **mais de um filho** e cria agendamentos separados:

```
Você: É pra minha filha e meu filho
Bot: Que legal! Qual o nome deles?
Você: Ana e Pedro
Bot: [Captura automaticamente como 2 pessoas]
     [Cria 2 agendamentos quando confirmar]
```

### Insistência Natural no Nome

O bot **persiste em pegar o nome**, mas de forma natural:
- **1ª tentativa**: "Qual é o seu nome?"
- **2ª tentativa**: "Antes que eu esqueça, qual é o seu nome mesmo? 😊"
- **3ª tentativa**: "Só pra eu anotar certinho, qual é o seu nome?"

Ele **não desiste facilmente**, mas sempre de forma amigável!

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta no Google AI Studio para obter API Key do Gemini
- WhatsApp instalado no celular

## Instalação

1. Clone ou baixe este repositório

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione sua API Key do Gemini:
```
GEMINI_API_KEY=sua_chave_api_aqui
PORT=3000
```

**Como obter a API Key do Gemini:**
- Acesse: https://makersuite.google.com/app/apikey
- Faça login com sua conta Google
- Clique em "Create API Key"
- Copie a chave e cole no arquivo `.env`

## Como usar

1. Inicie o sistema:
```bash
npm start
```

2. Acesse o painel em: `http://localhost:3000`

3. **Conecte o WhatsApp:**
   - Na aba "QR Code", escaneie o código com seu WhatsApp
   - Abra o WhatsApp > Menu (3 pontos) > Aparelhos conectados
   - Conecte um aparelho > Escaneie o QR Code

4. **Configure a escola:**
   - Na aba "Configurações", adicione informações sobre a Apex Sports
   - Endereço, diferenciais, horário de funcionamento, etc.

5. **Adicione os esportes:**
   - Na aba "Esportes", cadastre todos os esportes oferecidos
   - Ex: Futebol, Vôlei, Basquete, Natação, etc.

6. **Cadastre as turmas:**
   - Na aba "Turmas", crie as turmas com horários e dias disponíveis
   - Associe cada turma a um esporte
   - Defina o número de vagas disponíveis

7. **Acompanhe os resultados:**
   - Aba "Leads": Veja todos os contatos capturados
   - Aba "Agendamentos": Acompanhe as aulas experimentais marcadas
   - Aba "Históricos": Veja conversas e limpe quando necessário

## 📊 Painel de Controle Web

O sistema inclui um painel web completo com as seguintes funcionalidades:

### QR Code
- Visualize o QR Code para conectar o WhatsApp
- Status da conexão em tempo real
- Aviso se a API Key não estiver configurada

### Configurações
- Adicione informações sobre a escola
- Descreva diferenciais, endereço, horário de funcionamento

### Esportes
- **Adicionar** novos esportes
- **Editar** nome e descrição
- **Excluir** esportes (com confirmação)

### Turmas
- **Adicionar** turmas com esporte, dia, horário e vagas
- **Editar** turmas existentes (clique em "Editar")
- **Excluir** turmas (com confirmação)

### Leads
- Visualize todos os leads capturados
- Veja: Nome, Telefone, Para quem, Nome do filho
- **Excluir** leads (com confirmação)

### Agendamentos
- Acompanhe todas as aulas experimentais agendadas
- Veja: Nome, Telefone, Esporte, Turma, Data, Horário, Status

### Históricos de Conversas
- Veja todos os números que conversaram com o bot
- Total de mensagens por número
- Data da última mensagem
- **Limpar histórico** individual (com confirmação)
- Útil para testes e gerenciamento

## Estrutura do Projeto

```
apex-sports-chatbot/
├── src/
│   ├── database.js       # Configuração do banco de dados SQLite
│   ├── gemini.js         # Integração com Gemini AI
│   ├── whatsapp.js       # Integração com Baileys (WhatsApp)
│   ├── server.js         # Servidor Express
│   ├── index.js          # Arquivo principal
│   └── public/           # Interface web
│       ├── index.html    # HTML do painel
│       └── app.js        # JavaScript do painel
├── package.json
├── .env.example
└── README.md
```

## Banco de Dados

O sistema usa SQLite e cria automaticamente as seguintes tabelas:

- **config_escola**: Configurações e informações da escola
- **esportes**: Esportes disponíveis
- **turmas**: Turmas e horários
- **leads**: Contatos capturados
- **agendamentos**: Aulas experimentais agendadas
- **conversas**: Histórico de conversas

## Como o bot detecta agendamentos?

O bot é inteligente e detecta automaticamente quando um cliente confirma interesse em uma aula experimental. Ele extrai:

- Nome do cliente
- Se é para ele mesmo ou para filho(a)
- Esporte de interesse
- Turma escolhida
- Data e horário da aula experimental

Todas essas informações são salvas automaticamente no banco de dados.

## 🎨 Personalização

### Modificar o Comportamento do Bot

O comportamento conversacional do bot pode ser totalmente customizado editando o arquivo `src/gemini.js`:

#### 1. **Tom de Voz e Estilo**

Na função `gerarContextoSistema()` (linha ~45), você pode ajustar:

```javascript
return `Você é um atendente humano e natural da ${infoEscola}...`
```

**Ajustes possíveis:**
- **Tom de voz**: Altere de "atendente humano" para "vendedor entusiasmado", "consultor profissional", etc.
- **Uso de emojis**: Ajuste a quantidade ("use emojis ocasionalmente" → "use muitos emojis" ou "não use emojis")
- **Formalidade**: Mude de "você" para "senhor/senhora" para atendimento formal

#### 2. **Regras de Conversação**

Modifique as instruções na seção "COMO VOCÊ DEVE CONVERSAR":

```javascript
✅ FAÇA:
- SEMPRE pergunte o nome (tente pelo menos 2-3 vezes de forma natural)
- Converse naturalmente como um atendente real
- RESPONDA ao que a pessoa disser
```

**Personalizações:**
- Remover/adicionar regras
- Ajustar número de tentativas para pegar o nome
- Mudar o fluxo de perguntas

#### 3. **Exemplos de Conversa**

Adicione seus próprios exemplos na seção "EXEMPLOS DE CONVERSA NATURAL":

```javascript
Cliente: "Olá, tudo bem?"
Você: "Oi! Tudo ótimo, e você? 😊 Como posso te ajudar hoje?"
```

Quanto mais exemplos você adicionar, mais o bot aprende o estilo desejado!

#### 4. **Captura de Informações**

A extração automática está em `extrairInformacoes()` (linha ~223):

**Para adicionar novos campos:**
1. Adicione o campo no prompt JSON
2. Adicione a lógica de captura
3. Atualize o banco de dados se necessário

**Exemplo - Adicionar "idade":**
```javascript
{
  "nome_cliente": "...",
  "idade": "número ou null"  // <-- novo campo
}
```

#### 5. **Temperatura da IA**

Controle a criatividade do bot ajustando a `temperature` (linha ~191):

```javascript
generationConfig: {
  temperature: 0.7,  // 0.0 = robótico, 1.0 = muito criativo
  topK: 40,
  topP: 0.95,
}
```

**Recomendações:**
- `0.3-0.5`: Respostas mais consistentes e previsíveis
- `0.7-0.8`: Conversas naturais (padrão)
- `0.9-1.0`: Respostas mais criativas e variadas

#### 6. **Modelo de IA**

Troque o modelo do Gemini (linha ~193):

```javascript
model: 'gemini-2.0-flash-exp'  // Rápido e eficiente
// ou
model: 'gemini-pro'            // Mais robusto
```

### Modificar a Interface Web

Edite os arquivos em `src/public/`:
- `index.html`: Estrutura e estilos
- `app.js`: Comportamento da interface

## Troubleshooting

### Bot não conecta no WhatsApp
- Verifique se o QR Code está sendo exibido
- Tente escanear novamente
- Verifique sua conexão com a internet

### Bot não responde mensagens
- Verifique se a API Key do Gemini está correta
- Verifique os logs no terminal
- Certifique-se de que há créditos na sua conta Gemini

### Erro ao instalar dependências
- Use Node.js versão 16 ou superior
- No Windows, pode ser necessário instalar as ferramentas de build:
  ```bash
  npm install --global windows-build-tools
  ```

## Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## Aviso Legal

Este bot é para uso educacional e comercial legítimo. Certifique-se de:
- Ter autorização para usar o número de WhatsApp comercialmente
- Respeitar as políticas de uso do WhatsApp Business
- Cumprir a LGPD ao armazenar dados de clientes
- Usar a API do Gemini de acordo com os termos do Google

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs no terminal
2. Consulte a documentação do [Baileys](https://github.com/WhiskeySockets/Baileys)
3. Consulte a documentação do [Gemini AI](https://ai.google.dev/)

## Licença

MIT License - Você pode usar, modificar e distribuir livremente.

---

Feito com ❤️ para Apex Sports
