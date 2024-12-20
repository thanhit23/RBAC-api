import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';

import DB from '@/database';
import { TokenTypes } from './tokens';
import Users from '@/model/Users';

const jwtOptions = {
  secretOrKey: 'SECRET',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const users = await DB.getEntityManager().findOne(Users, { id: payload.sub })

    if (!users) {
      done(null, false);
    }

    done(null, users);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
