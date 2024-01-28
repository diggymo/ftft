import { Body, Post, Query } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizedUser, UserFragment } from 'src/user/user.decorator';
import { StorageService } from './storage.servuce';
import { randomUUID } from 'crypto';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getObjectUrl(@AuthorizedUser() user: UserFragment, @Query() _query: any) {
    const query = z
      .object({
        filename: z.string().min(1),
        contentType: z.string().min(1),
      })
      .parse(_query);
    const url = await this.storageService.getPuttingObjectUrl({
      key: user.userId + '/' + randomUUID() + query.filename,
      contentType: query.contentType,
    });

    return {
      url,
    };
  }
}
