import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
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

  // Criar professor exemplo
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

  // Criar aluno exemplo
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
