import { first, isEmpty } from 'lodash';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';

import DB from '@/database';
import Users from '@/model/Users';

import { TokenTypes } from './tokens';
import { ROLE } from './roles';

const jwtOptions = {
  secretOrKey: 'SECRET',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const user = await DB.getEntityManager().findOne(Users, { id: payload.sub })

    if (!user) {
      done(null, false);
    }

    const role = await DB.getEntityManager().getConnection().execute(`
      SELECT UserRoles.id AS id, Roles.name AS name
      FROM UserRoles
      LEFT JOIN Roles ON Roles.id = UserRoles.role_id
      WHERE user_id = ${user?.id};
    `);

    done(null, { ...user, role: !isEmpty(role) ? first(role)?.name : ROLE.user });
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
