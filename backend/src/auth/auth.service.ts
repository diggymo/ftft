import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user === null) return null;

    // FIXME: bcryptの挙動がLambda環境とローカルで異なり、Lambda実行時にエラーになるため、一旦plainで比較させる
    // const isPasswordMatched = await bcrypt.compare(password, user.password);
    const isPasswordMatched = password === user.password;
    if (!isPasswordMatched) return null;

    const { password: _, ...response } = user;
    return response;
  }

  login(user: User) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
