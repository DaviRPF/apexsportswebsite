import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { processarMensagem } from './gemini.js';

let sock;
let qrCodeData = null;
let isConnected = false;

export async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect: true,
    getMessage: async (key) => {
      return { conversation: '' };
    }
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      console.log('\n📱 QR Code gerado! Escaneie com seu WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      console.log('\nOu acesse http://localhost:3000 para escanear\n');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('❌ Conexão fechada. Reconectando...', shouldReconnect);
      isConnected = false;
      qrCodeData = null;

      if (shouldReconnect) {
        startWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
      isConnected = true;
      qrCodeData = null;
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      // Ignorar mensagens de status e do próprio bot
      if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.fromMe) {
        continue;
      }

      const telefone = msg.key.remoteJid;
      const mensagemTexto = msg.message.conversation ||
                            msg.message.extendedTextMessage?.text ||
                            '';

      if (!mensagemTexto) continue;

      console.log(`\n📩 Mensagem recebida de ${telefone}:`);
      console.log(`   ${mensagemTexto}`);

      try {
        // Marcar como lido
        await sock.readMessages([msg.key]);

        // Enviar indicador de digitação
        await sock.sendPresenceUpdate('composing', telefone);

        // Processar mensagem com Gemini
        const resposta = await processarMensagem(telefone, mensagemTexto);

        // Pequeno delay para parecer mais natural
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Enviar resposta
        await sock.sendMessage(telefone, { text: resposta });

        console.log(`\n✅ Resposta enviada para ${telefone}:`);
        console.log(`   ${resposta}\n`);

        // Remover indicador de digitação
        await sock.sendPresenceUpdate('paused', telefone);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        await sock.sendMessage(telefone, {
          text: 'Desculpe, tive um problema técnico. Pode tentar novamente em instantes?'
        });
      }
    }
  });

  return sock;
}

export function getQRCode() {
  return qrCodeData;
}

export function getConnectionStatus() {
  return isConnected;
}

export function getSock() {
  return sock;
}
