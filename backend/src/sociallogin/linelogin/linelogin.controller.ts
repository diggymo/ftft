import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { LineLoginService } from './linelogin.servuce';

@ApiTags('social-login')
@Controller('social-login/line')
export class LineLoginController {
  constructor(private readonly lineLoginService: LineLoginService) {}

  @Post('callback')
  async callback(@Body() _body: any) {
    const body = z
      .object({
        code: z.string().min(1),
        callbaclUrl: z.string().min(1),
      })
      .parse(_body);
    const accessToken = await this.lineLoginService.login(body.code, body.callbaclUrl);

    return {
      accessToken,
    };
  }

  @Post('liff')
  async liff(@Body() _body: any) {
    const body = z
      .object({
        idToken: z.string().min(1),
      })
      .parse(_body);
    const accessToken = await this.lineLoginService.loginByIdToken(body.idToken);

    return {
      accessToken,
    };
  }
}
