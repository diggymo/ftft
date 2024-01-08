import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { setAppConfig } from 'src/main';
import { PrismaService, PrismaTestService } from 'src/prisma/prisma.service';
import { UserSchema } from 'src/user/user.entity';
import { createUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from 'src/_test/helper/createFixture';
import { resetAllData } from 'src/_test/helper/resetAllDbData';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }) // テスト用DBに切り替え
      .overrideProvider(PrismaService)
      .useClass(PrismaTestService)
      .compile();

    const _app = moduleRef.createNestApplication();
    app = setAppConfig(_app);
    await app.init();
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await resetAllData(prisma);
  }, 15000);

  beforeEach(async () => {
    await resetAllData(prisma);
    user = await createUser(prisma);
  });

  describe(`POST /auth/login`, () => {
    it('正常系', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER_EMAIL,
          password: TEST_USER_PASSWORD,
        })
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
