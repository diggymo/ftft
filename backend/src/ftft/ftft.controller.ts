import { Body, Post, Query } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { FtftService } from './ftft.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizedUser, UserFragment } from 'src/user/user.decorator';

@ApiTags('ftft')
@Controller('ftft')
export class FtftController {
  constructor(private readonly ftftService: FtftService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  searchFtfts(@AuthorizedUser() user: UserFragment, @Query() _query: any) {
    const query = z
      .object({
        lastId: z.string().min(1).optional(),
      })
      .parse(_query);
    return this.ftftService.searchFtft(user.userId, query.lastId);
  }

  @Post('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createFtft(@AuthorizedUser() user: UserFragment, @Body() _body: any) {
    const body = z
      .object({
        title: z.string().min(1),
      })
      .parse(_body);
    return this.ftftService.createFtft({ ftft: { userId: user.userId, title: body.title } });
  }
}
