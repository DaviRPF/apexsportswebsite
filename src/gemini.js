import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getEsportes,
  getTurmas,
  getConfig,
  getOrCreateLead,
  updateLead,
  createAgendamento,
  saveMessage,
  getConversationHistory
} from './database.js';

let genAI = null;

// Função para verificar e inicializar a API Key
function checkAndInitAPI() {
  if (genAI) return true; // Já inicializado

  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'sua_chave_api_aqui' && apiKey.length > 10;

  if (hasValidApiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini AI inicializado com sucesso');
    return true;
  }

  console.error('❌ GEMINI_API_KEY não encontrada ou inválida');
  console.error('   Valor atual:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
  return false;
}

// Função para gerar o contexto do sistema
function gerarContextoSistema() {
  const esportes = getEsportes();
  const turmas = getTurmas();
  const infoEscola = getConfig('info_escola') || 'Apex Sports - Escola de Esportes';

  const listaEsportes = esportes.map(e => `- ${e.nome}: ${e.descricao || 'Esporte disponível'}`).join('\n');

  const listaTurmas = turmas.map(t =>
    `- ${t.esporte_nome} - ${t.nome}: ${t.dia_semana} às ${t.horario} (${t.vagas_disponiveis} vagas disponíveis)`
  ).join('\n');

  return `Você é um atendente humano e natural da ${infoEscola}. Converse de forma fluida e autêntica, como um vendedor experiente conversaria no WhatsApp.

══════════════════════════════════════════════════════════════
INFORMAÇÕES DA ESCOLA
══════════════════════════════════════════════════════════════
${infoEscola}

══════════════════════════════════════════════════════════════
ESPORTES E TURMAS DISPONÍVEIS
══════════════════════════════════════════════════════════════
${listaEsportes || 'Nenhum esporte cadastrado'}

HORÁRIOS:
${listaTurmas || 'Nenhuma turma cadastrada'}

══════════════════════════════════════════════════════════════
COMO VOCÊ DEVE CONVERSAR
══════════════════════════════════════════════════════════════

🎯 OBJETIVO: Agendar aula experimental de forma NATURAL

⚠️ REGRA NÚMERO 1 - SEMPRE PERGUNTE O NOME:
- Na PRIMEIRA interação, SEMPRE cumprimente e pergunte o nome da pessoa
- Exemplo: "Oi! Tudo bem? 😊 Qual é o seu nome?"
- Se a pessoa perguntar sobre aulas ANTES de dar o nome, responda naturalmente sobre o assunto E depois peça o nome
- Exemplo: "Isso mesmo! Temos aulas de vôlei sim 😊 E qual é o seu nome?"
- NÃO ignore o que a pessoa perguntou!

✅ FAÇA:
- SEMPRE pergunte o nome (tente pelo menos 2-3 vezes de forma natural)
- Converse naturalmente como um atendente real
- RESPONDA ao que a pessoa disser (se ela perguntou algo, responda!)
- Se ela desviou do assunto, responda E depois volte a perguntar o nome
- Seja amigável, use emojis ocasionalmente 😊
- Quando souber o nome dela, use o nome na conversa
- Capture informações conforme elas aparecem naturalmente
- Se a pessoa mencionar MÚLTIPLOS filhos (ex: "Ana e Pedro"), pergunte sobre cada um
- Apresente os esportes de forma natural no momento certo
- Sugira horários quando fizer sentido
- Adapte-se ao estilo da pessoa (formal/informal)

❌ NÃO FAÇA:
- NÃO siga um roteiro rígido
- NÃO pergunte tudo de uma vez
- NÃO seja robotizado
- NÃO force perguntas se a pessoa já deu a informação
- NÃO invente informações sobre esportes/horários que não existem
- NUNCA esqueça de perguntar o nome no início!

══════════════════════════════════════════════════════════════
INFORMAÇÕES QUE VOCÊ PRECISA DESCOBRIR (naturalmente)
══════════════════════════════════════════════════════════════
1. ⭐ Nome da pessoa que está falando com você (PRIMEIRA COISA!)
2. A aula é para ela mesma ou para filho/filha?
3. Se for para filho/filha, qual o nome?
4. Qual esporte interessa?
5. Qual horário/turma funciona melhor?

⚠️ Descubra isso aos poucos, na CONVERSA, não em questionário!

══════════════════════════════════════════════════════════════
EXEMPLOS DE CONVERSA NATURAL
══════════════════════════════════════════════════════════════

Cliente: "Olá, tudo bem?"
Você: "Oi! Tudo ótimo, e você? 😊 Como posso te ajudar hoje?"

Cliente: "Queria saber sobre aulas de futebol"
Você: "Ah, que legal! Temos turmas de futebol sim. É para você ou para algum filho/filha?"

Cliente: "É pro meu filho João, ele tem 8 anos"
Você: "Que bacana! O João vai adorar. Temos turmas [mencionar horários]. Qual desses horários funcionaria melhor pra vocês?"

══════════════════════════════════════════════════════════════
QUANDO CONFIRMAR O AGENDAMENTO
══════════════════════════════════════════════════════════════
Quando a pessoa CONFIRMAR data e horário, use EXATAMENTE este formato:

Combinado! Vou agendar para [Nome] 🎉

[AGENDAMENTO_CONFIRMADO]
Turma: [nome da turma]
Data: [data]
Horário: [horário]

Nos vemos lá! Qualquer coisa, estou aqui.

══════════════════════════════════════════════════════════════
LEMBRE-SE
══════════════════════════════════════════════════════════════
Você é um HUMANO conversando no WhatsApp, não um chatbot com roteiro. Seja natural, genuíno e ajude a pessoa a encontrar a melhor aula experimental! 💪`;

}

// Função para processar a mensagem e detectar agendamentos
export async function processarMensagem(telefone, mensagem) {
  try {
    // Verificar e inicializar a API Key
    if (!checkAndInitAPI()) {
      const resposta = `Olá! 👋

Nosso chatbot ainda está sendo configurado. Por favor, entre em contato novamente em alguns minutos ou ligue para nossa central.

Obrigado pela compreensão!`;

      console.error('⚠️  Tentativa de enviar mensagem sem API Key configurada');
      return resposta;
    }

    // Salvar mensagem do usuário
    saveMessage(telefone, mensagem, 'user');

    // Buscar ou criar lead
    const lead = getOrCreateLead(telefone);

    // Buscar histórico da conversa
    const historico = getConversationHistory(telefone, 10);

    // Contexto do sistema (instruções)
    let contextoSistema = gerarContextoSistema();

    // Se não tem nome, FORÇAR pergunta do nome
    if (!lead.nome) {
      if (historico.length < 2) {
        // Primeira interação
        contextoSistema += `\n\n⚠️⚠️⚠️ ATENÇÃO URGENTE ⚠️⚠️⚠️
Esta pessoa AINDA NÃO disse o nome dela!
Você DEVE perguntar o nome dela AGORA!
- Se ela perguntou algo, responda brevemente E peça o nome
- Exemplo: "Isso mesmo! Temos aulas de vôlei sim 😊 E qual é o seu nome?"
- OU: "Oi! Tudo bem? 😊 Qual é o seu nome?"
NÃO esqueça de perguntar o nome!`;
      } else if (historico.length < 6) {
        // Tentativa 2-3
        contextoSistema += `\n\n⚠️⚠️⚠️ ATENÇÃO ⚠️⚠️⚠️
Esta pessoa AINDA NÃO disse o nome dela!
Tente perguntar o nome de novo de forma natural!
Exemplo: "Ah, antes que eu esqueça, qual é o seu nome mesmo? 😊"
OU: "Só pra eu anotar certinho aqui, qual é o seu nome?"`;
      } else if (historico.length < 10) {
        // Tentativa 4-5
        contextoSistema += `\n\n⚠️ LEMBRETE
A pessoa não disse o nome ainda. Tente perguntar mais uma vez de forma sutil.`;
      }
    }

    // Criar o modelo com system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: contextoSistema
    });

    // Montar o histórico para o Gemini
    let history = historico.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.mensagem }]
    }));

    // O Gemini exige que:
    // 1. O histórico sempre comece com 'user'
    // 2. As mensagens se alternem entre 'user' e 'model'

    // Remover mensagens do início se começar com 'model'
    while (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }

    // Garantir alternância de roles (remover duplicatas consecutivas)
    history = history.filter((msg, index) => {
      if (index === 0) return true;
      return msg.role !== history[index - 1].role;
    });

    // Criar chat com histórico
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Enviar mensagem (sem precisar repetir contexto)
    const result = await chat.sendMessage(mensagem);
    const resposta = result.response.text();

    // Salvar resposta do bot
    saveMessage(telefone, resposta, 'assistant');

    // Detectar informações importantes na conversa
    await extrairInformacoes(telefone, mensagem, resposta);

    // Detectar agendamento confirmado
    if (resposta.includes('[AGENDAMENTO_CONFIRMADO]')) {
      await processarAgendamento(telefone, resposta);
    }

    return resposta.replace('[AGENDAMENTO_CONFIRMADO]', '').trim();
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
    return 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?';
  }
}

// Extrair informações do cliente durante a conversa
async function extrairInformacoes(telefone, mensagemUsuario, respostaBot) {
  try {
    if (!genAI) return;

    const lead = getOrCreateLead(telefone);
    const dadosParaAtualizar = {};

    // Usar IA para extrair todas as informações de uma vez
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `Analise a CONVERSA e extraia informações do cliente:

MENSAGEM DO CLIENTE: "${mensagemUsuario}"
RESPOSTA DO BOT ANTERIOR: "${respostaBot}"

Responda APENAS no formato JSON:
{
  "nome_cliente": "nome da pessoa que está conversando" ou null,
  "para_quem": "proprio" ou "filho" ou null,
  "nomes_filhos": ["nome1", "nome2"] ou []
}

REGRAS IMPORTANTES:
- nome_cliente: Se a pessoa se apresentar (ex: "Meu nome é João", "Sou a Maria", "João aqui", "Davi")
- para_quem: "filho" se mencionar filho/filha/criança, "proprio" se for para ela mesma
- nomes_filhos: Array com TODOS os nomes de filhos mencionados
  * Se mencionar 1 filho: ["Pedro"]
  * Se mencionar 2: ["Ana", "Pedro"] ou ["aninha", "cleber"]
  * Separe "Ana e Pedro" em ["Ana", "Pedro"]
  * Separe "aninha e cleber" em ["Aninha", "Cleber"]
  * Se não mencionar nenhum, deixe []

CONTEXTO:
- Se o bot perguntou "qual o nome do seu filho?" e a pessoa responde nomes, capture todos
- Se a pessoa diz "pra minha filha e talvez pro irmão", ela tem MÚLTIPLOS filhos (aguarde os nomes)
- Se a pessoa diz "aninha e cleber", são 2 nomes diferentes: ["Aninha", "Cleber"]
- Se o bot perguntou "qual é o seu nome?" e a pessoa responde um nome simples (ex: "Davi", "João"), capture como nome_cliente

Se não encontrar alguma informação, coloque null ou [].
Responda APENAS o JSON, sem explicações.`;

    const result = await model.generateContent(prompt);
    const respostaTexto = result.response.text().trim();

    // Tentar extrair JSON da resposta
    let jsonMatch = respostaTexto.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const dados = JSON.parse(jsonMatch[0]);

      // Atualizar apenas campos que não estão null e que ainda não foram preenchidos
      if (dados.nome_cliente && !lead.nome) {
        dadosParaAtualizar.nome = dados.nome_cliente;
      }

      if (dados.para_quem && !lead.para_quem) {
        dadosParaAtualizar.para_quem = dados.para_quem;
      }

      // Processar múltiplos filhos
      if (dados.nomes_filhos && Array.isArray(dados.nomes_filhos) && dados.nomes_filhos.length > 0) {
        // Se já tem nome_filho salvo e agora veio array vazio, não sobrescrever
        if (!lead.nome_filho || lead.nome_filho === '') {
          // Juntar os nomes com vírgula
          dadosParaAtualizar.nome_filho = dados.nomes_filhos.join(', ');
        }
      }

      // Atualizar lead se houver dados novos
      if (Object.keys(dadosParaAtualizar).length > 0) {
        updateLead(telefone, dadosParaAtualizar);
        console.log(`📝 Informações capturadas:`, dadosParaAtualizar);
      }
    }
  } catch (error) {
    console.error('Erro ao extrair informações:', error);
  }
}

// Processar agendamento confirmado
async function processarAgendamento(telefone, resposta) {
  try {
    // Extrair informações do agendamento
    const linhas = resposta.split('\n');
    let turma = null;
    let data = null;
    let horario = null;

    for (const linha of linhas) {
      if (linha.includes('Turma:')) {
        turma = linha.replace('Turma:', '').trim();
      } else if (linha.includes('Data:')) {
        data = linha.replace('Data:', '').trim();
      } else if (linha.includes('Horário:')) {
        horario = linha.replace('Horário:', '').trim();
      }
    }

    // Buscar a turma correspondente
    const turmas = getTurmas();
    const turmaEncontrada = turmas.find(t =>
      t.nome.toLowerCase().includes(turma.toLowerCase()) ||
      turma.toLowerCase().includes(t.nome.toLowerCase())
    );

    if (turmaEncontrada && data && horario) {
      // Buscar o lead para ver se tem múltiplos filhos
      const lead = getOrCreateLead(telefone);

      if (lead.nome_filho && lead.nome_filho.includes(',')) {
        // Múltiplos filhos - criar um agendamento para cada
        const nomes = lead.nome_filho.split(',').map(n => n.trim());
        for (const nome of nomes) {
          createAgendamento(telefone, turmaEncontrada.id, data, horario);
          console.log(`✅ Agendamento criado para ${nome}: ${telefone} - ${turma} - ${data} ${horario}`);
        }
      } else {
        // Um filho apenas
        createAgendamento(telefone, turmaEncontrada.id, data, horario);
        console.log(`✅ Agendamento criado: ${telefone} - ${turma} - ${data} ${horario}`);
      }
    }
  } catch (error) {
    console.error('Erro ao processar agendamento:', error);
  }
}

export { gerarContextoSistema };
