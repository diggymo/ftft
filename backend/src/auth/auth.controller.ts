import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * メールアドレス/パスワードを利用してログインします。<br/>
   * ログインに成功するとJWT形式のアクセストークンが返却されます。<br/>
   * このトークンはユーザーIDや有効期限を含んでいます
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ type: LoginResponse })
  @Post('login')
  async login(@Request() req: { user: User }) {
    return this.authService.login(req.user) as LoginResponse;
  }
}
