import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/loca.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (jwtSecret === undefined) throw new Error('JWT_SECRET is not defined');
        return {
          secret: jwtSecret,
        };
      },
      inject: [ConfigService],
    }),

    // secret: process.env.JWT_SECRET,
    // signOptions: { expiresIn: '30d' },
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
