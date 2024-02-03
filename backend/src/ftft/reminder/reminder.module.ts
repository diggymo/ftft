import { Module } from '@nestjs/common';
import { FtftModule } from '../ftft.module';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FtftModule, UserModule],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class ReminderModule {}
