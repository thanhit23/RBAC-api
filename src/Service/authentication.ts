import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';

import config from '@/config/config';
import { TokenTypes } from '@/config/tokens';
import User, { RegisterBody } from '@/model/Users';
import AuthenticationRepository from "@/repository/authentication";

class AuthenticationService {
  static async register(body: RegisterBody) {
    return await AuthenticationRepository.register(body);
  }
  static async generateAuthTokens(user: User) {
    const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = this.generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS);
  
    const refreshTokenExpires = dayjs().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH);
  
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };
  static generateToken(userId: string | number, expires: dayjs.Dayjs, type: keyof typeof TokenTypes, secret = 'SECRET') {
    const payload = {
      sub: userId,
      iat: dayjs().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };
  static async login(body: RegisterBody) {
    const responsive = await AuthenticationRepository.login(body);

    const token = await this.generateAuthTokens(responsive.data);

    return { ...responsive, data: token }
  }
}

export default AuthenticationService;
