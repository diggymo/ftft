import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import jwt from 'jsonwebtoken';

type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token: string;
};

@Injectable()
export class LineLoginService {
  #lineChannelSecret = '';
  #lineChannelId = '';

  constructor(private userService: UserService, private authService: AuthService) {
    if (process.env.LINE_CHANNEL_SECRET === undefined) {
      throw new Error('LINE_CHANNEL_SECRETが設定されていません');
    }

    this.#lineChannelSecret = process.env.LINE_CHANNEL_SECRET;
    this.#lineChannelId = '2003019183';
  }

  public async login(code: string, callbaclUrl: string): Promise<string> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', callbaclUrl);
    params.append('client_id', this.#lineChannelId);
    params.append('client_secret', this.#lineChannelSecret);
    const response = await axios.post<TokenResponse>('https://api.line.me/oauth2/v2.1/token', params);

    const payloadStr = Buffer.from(response.data.id_token.split('.')[1], 'base64').toString();
    const payload = JSON.parse(payloadStr) as { sub: string };
    const lineUserId = payload.sub;

    const lineUser = await this.userService.createLineUser(lineUserId);

    const { accessToken } = this.authService.login(lineUser);
    return accessToken;
  }

  public async loginByIdToken(idToken: string) {
    const params = new URLSearchParams();
    params.append('id_token', idToken);
    params.append('client_id', this.#lineChannelId);
    const lineUserId = await axios
      .post<{ sub: string }>('https://api.line.me/oauth2/v2.1/verify', params)
      .then((response) => {
        return response.data.sub;
      })
      .catch((error) => {
        console.error('IDトークンの検証に失敗しました');
        console.error(error.response.data);
        throw error;
      });

    const lineUser = await this.userService.createLineUser(lineUserId);
    const { accessToken } = this.authService.login(lineUser);
    return accessToken;
  }
}
