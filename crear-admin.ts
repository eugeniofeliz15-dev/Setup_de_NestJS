import { PrismaClient } from './generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Conectando a la base de datos...');
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinica.com' },
    update: { password: passwordHash, role: 'GERENCIA' },
    create: {
      email: 'admin@clinica.com',
      password: passwordHash,
      role: 'GERENCIA',
      firstName: 'Admin',
      lastName: 'Clinica',
    },
  });
  
  console.log('✅ ¡ÉXITO! Admin listo:');
  console.log('   Email:', admin.email);
  console.log('   Contraseña: 123456');
  console.log('   Rol:', admin.role);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());