import { Post, Query } from '@nestjs/common';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/auth/guards/apikey.guard';
import { ReminderService } from './reminder.service';

@ApiTags('ftft/reminder')
@Controller('ftft/reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post('')
  @ApiBearerAuth()
  @UseGuards(ApiKeyGuard)
  async searchFtfts(@Query() _query: any) {
    await this.reminderService.remindToAllLineUsers();
    return { '###': true };
  }
}
