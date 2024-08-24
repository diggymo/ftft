import { Module } from '@nestjs/common';
import { FtftService } from '../ftft.service';
import { UserService } from 'src/user/user.service';
import { differenceInCalendarDays, getDay } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Ftft } from '../ftft.entity';
import { logger } from 'src/common/logger';

const REMINDER_DAYS = [2, 4, 7, 14, 30, 60, 90];

@Module({})
export class ReminderService {
  constructor(
    private readonly userService: UserService,
    private readonly ftftService: FtftService,
    private readonly configService: ConfigService,
  ) {}

  async remindToAllLineUsers() {
    const currentDate = new Date();
    const lineUsers = await this.userService.findAllLineUsers();

    for (const lineUser of lineUsers) {
      const ftftList = await this.ftftService.searchFtft(lineUser.id, undefined, 1);
      if (ftftList.length === 0) {
        continue;
      }

      const distanceDays = differenceInCalendarDays(currentDate, ftftList[0].createdAt);
      if (!REMINDER_DAYS.includes(distanceDays)) {
        continue;
      }
      await this.sendRemind(lineUser.lineUserId, distanceDays).catch((error) => {
        console.error({ message: 'メッセージが送信できませんでした', error });
      });
    }

    for (const lineUser of lineUsers) {
      const ftftList = await this.ftftService.searchFtft(lineUser.id, undefined, 1000);
      if (ftftList.length === 0) {
        continue;
      }
      logger.debug({ message: '何件か取得しました', length: ftftList.length });

      const randomFtftIndexSet = new Set([
        Math.floor(ftftList.length * Math.random()),
        Math.floor(ftftList.length * Math.random()),
        Math.floor(ftftList.length * Math.random()),
      ]);
      const randomFtftList = Array.from(randomFtftIndexSet.values()).map((index) => ftftList[index]);

      logger.debug({ message: 'ランダムに取得しました', set: [...randomFtftIndexSet.values()], list: randomFtftList });

      await this.sendLookbackMessage(lineUser.lineUserId, randomFtftList).catch((error) => {
        logger.error({
          message: 'メッセージが送信できませんでした',
          error,
        });
      });
    }
  }

  async sendRemind(lineUserId: string, howManyDaysAgo: number) {
    const templates = [
      `最近、何か新しいこと始めた？👀\nもしあればFTFTにメモってみよう🚀\nhttps://liff.line.me/2003019183-014OmGVB`,
      `${howManyDaysAgo}日前から記録がなさそうだけど元気にしてる？🙄\nFTFTにメモってみよう🚀\nhttps://liff.line.me/2003019183-014OmGVB`,
      `ふと思ったことはなんでもFTFTに書いてみよう✍️\nhttps://liff.line.me/2003019183-014OmGVB`,
    ];

    return axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: lineUserId,
        messages: [
          {
            type: 'text',
            text: templates[Math.floor(templates.length * Math.random())],
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

  sendLookbackMessage(lineUserId: string, ftftList: Ftft[]) {
    const colors = ['#3327b2', '#27ACB2', '#FF6B6E', '#A17DF5', '#B28827', '#B227a4'];
    const contents = ftftList.map((ftft, i) => {
      return this.getLookbackFlexMessageBubbleTemplate(ftft, colors[Math.floor(colors.length * Math.random())]);
    });
    return axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: lineUserId,
        messages: [
          {
            type: 'flex',
            altText: '過去のFTFTをみてみよう',
            contents: {
              type: 'carousel',
              contents: contents,
            },
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

  getLookbackFlexMessageBubbleTemplate(ftft: Pick<Ftft, 'emoji' | 'title' | 'createdAt'>, color: string) {
    return {
      type: 'bubble',
      size: 'deca',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: ftft.title,
            color: '#ffffff',
            align: 'start',
            size: 'sm',
            gravity: 'center',
            wrap: true,
            flex: 0,
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: ftft.emoji || '_',
                    size: 'lg',
                  },
                ],
                backgroundColor: '#FFFFFF',
                cornerRadius: '999px',
                justifyContent: 'center',
                alignItems: 'center',
                spacing: 'none',
                width: ftft.emoji === undefined ? '0px' : '36px',
                height: '36px',
              },
              {
                type: 'text',
                text: `${differenceInCalendarDays(new Date(), ftft.createdAt)}日前`,
                flex: 1,
                color: '#FFFFFF',
              },
            ],
            alignItems: 'center',
            spacing: '12px',
          },
        ],
        backgroundColor: color,
        paddingAll: '12px',
        spacing: '12px',
      },
      styles: {
        footer: {
          separator: false,
        },
      },
    };
  }
}
