import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import z from 'zod';
import { AuthorizedUser, UserFragment } from './user/user.decorator';
import { JwtAuthGuard } from './auth/guards/jwt.guard';

@Controller('')
export class AppController {
  /** ヘルスチェックのためのエンドポイントです */
  @Get('healthcheck')
  healthCheck() {
    return hoge.parse({
      hoge: '###',
      huga: 2,
    });
  }

  @Get('authed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  authed(@AuthorizedUser() user: UserFragment) {
    return user;
  }
}

const hoge = z.object({
  hoge: z.string(),
  huga: z.number(),
});
