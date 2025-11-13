import dotenv from 'dotenv';
import { startWhatsApp } from './whatsapp.js';
import { startServer } from './server.js';
import { clearOldConversations } from './database.js';

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se a API Key do Gemini está configurada
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'sua_chave_api_aqui') {
  console.warn('⚠️  AVISO: GEMINI_API_KEY não configurada!');
  console.log('\n📝 O bot não poderá responder mensagens até você configurar a chave.');
  console.log('   Para configurar, edite o arquivo .env e adicione:');
  console.log('   GEMINI_API_KEY=sua_chave_aqui\n');
  console.log('💡 Obtenha sua chave em: https://aistudio.google.com/app/apikey');
  console.log('🌐 O painel web será iniciado normalmente para você configurar.\n');
} else {
  console.log('✅ GEMINI_API_KEY carregada:', apiKey.substring(0, 10) + '...');
}

async function main() {
  console.log('\n🚀 Iniciando Apex Sports Chatbot...\n');

  try {
    // Limpar conversas antigas (mais de 30 dias)
    clearOldConversations(30);

    // Iniciar servidor web
    const port = process.env.PORT || 3000;
    startServer(port);

    // Iniciar WhatsApp
    await startWhatsApp();

    console.log('\n✅ Sistema inicializado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 Acesse http://localhost:' + port + ' para configurar');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Erro ao iniciar o sistema:', error);
    process.exit(1);
  }
}

main();
