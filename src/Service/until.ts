import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '@/model/Users';
import config from '@/config/config';
import { TokenTypes } from '@/config/tokens';

class UntilService {
  static async hashPassword(passwordString: string) {
    return bcrypt.hashSync(passwordString, 10);
  }

  static async comparePassword(passwordString: string, password: string) {
    return bcrypt.compareSync(passwordString, password)
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
}

export default UntilService;
