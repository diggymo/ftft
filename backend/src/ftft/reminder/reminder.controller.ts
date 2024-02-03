import { Body, Post, Query } from '@nestjs/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import z from 'zod';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizedUser, UserFragment } from 'src/user/user.decorator';
import { FtftService } from '../ftft.service';
import { ApiKeyGuard } from 'src/auth/guards/apikey.guard';
import { ReminderService } from './reminder.service';

@ApiTags('ftft/reminder')
@Controller('ftft/reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(ApiKeyGuard)
  async searchFtfts(@Query() _query: any) {
    console.log(_query);

    await this.reminderService.remindToAllLineUsers();
    return { '###': true };
  }
}
