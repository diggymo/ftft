import { Module } from '@nestjs/common';
import { FtftService } from '../ftft.service';
import { UserService } from 'src/user/user.service';
import { isPast, addDays, isFuture } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Module({})
export class ReminderService {
  constructor(
    private readonly userService: UserService,
    private readonly ftftService: FtftService,
    private readonly configService: ConfigService,
  ) {}

  async remindToAllLineUsers() {
    const lineUsers = await this.userService.findAllLineUsers();

    console.log(lineUsers.length);
    for (const lineUser of lineUsers) {
      const ftftList = await this.ftftService.searchFtft(lineUser.id, undefined, 1);
      console.log(ftftList);
      if (ftftList.length === 0) {
        continue;
      }

      // 3日以上前~4日以内か
      const isTarget = isPast(addDays(ftftList[0].createdAt, 3)) && isFuture(addDays(ftftList[0].createdAt, 4));
      if (!isTarget) {
        continue;
      }
      await this.sendRemind(lineUser.lineUserId).catch((error) => {
        console.error({ message: 'メッセージが送信できませんでした', error });
      });
    }
  }

  async sendRemind(lineUserId: string) {
    return axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text: '最近、何か新しいこと始めた？👀\nもしあればFTFTにメモってみよう🚀\nhttps://ftft.morifuji-is.ninja/',
          },
        ],
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.configService.getOrThrow('LINE_CHANNEL_SECRET_FOR_MESSAGING'),
        },
      },
    );
  }
}
