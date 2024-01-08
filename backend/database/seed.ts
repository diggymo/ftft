// import { PrismaClient } from '@prisma/client';
// import { createUser } from '../src/_test/helper/createFixture';

// const prisma = new PrismaClient();

// /**
//  * 初期データを作成するスクリプト
//  */
// const exec = async () => {
//   await createUser(prisma);
// };

// exec()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
