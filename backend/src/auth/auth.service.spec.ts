import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/loca.strategy';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        UserModule,
        ConfigModule,
        PassportModule,
        JwtModule.register({
          secret: 'aaa',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }) // テスト用DBに切り替え
      .overrideProvider(PrismaService)
      .useClass(PrismaTestService)
      .compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<AuthService>(AuthService);
  });

  beforeEach(async () => {
    await resetAllData(prisma);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('service.validateUser', () => {
    beforeEach(async () => {
      await createUser(prisma);
    });
    it('正しいユーザーと突合できるか', async () => {
      const user = await service.validateUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);
      expect(user).toMatchObject({ email: TEST_USER_EMAIL });
    });

    it('メールアドレスが間違っている場合ユーザーを取得できないこと', async () => {
      const user = await service.validateUser('marooon88+invalid@gmail.com', TEST_USER_PASSWORD);
      expect(user).toBeNull();
    });
    it('パスワードが間違っている場合ユーザーを取得できないこと', async () => {
      const user = await service.validateUser(TEST_USER_EMAIL, 'invalid');
      expect(user).toBeNull();
    });
  });
});
