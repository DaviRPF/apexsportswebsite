"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@apexsports.com' },
        update: {},
        create: {
            nome: 'Administrador',
            email: 'admin@apexsports.com',
            senha: hashedPassword,
            tipo: 'admin',
            ativo: true,
        },
    });
    console.log('✅ Usuário admin criado:', admin.email);
    const professor = await prisma.usuario.upsert({
        where: { email: 'professor@apexsports.com' },
        update: {},
        create: {
            nome: 'Professor Exemplo',
            email: 'professor@apexsports.com',
            senha: hashedPassword,
            tipo: 'professor',
            ativo: true,
        },
    });
    console.log('✅ Usuário professor criado:', professor.email);
    const aluno = await prisma.usuario.upsert({
        where: { email: 'aluno@apexsports.com' },
        update: {},
        create: {
            nome: 'Aluno Exemplo',
            email: 'aluno@apexsports.com',
            senha: hashedPassword,
            tipo: 'aluno',
            ativo: true,
        },
    });
    console.log('✅ Usuário aluno criado:', aluno.email);
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📝 Credenciais para teste:');
    console.log('   Admin: admin@apexsports.com / admin123');
    console.log('   Professor: professor@apexsports.com / admin123');
    console.log('   Aluno: aluno@apexsports.com / admin123');
}
main()
    .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map