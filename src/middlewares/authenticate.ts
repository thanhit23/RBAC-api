import passport from 'passport';
import { lowerCase } from 'lodash';
import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import User from '@/model/Users';
import Roles from '@/model/Roles';

const verifyCallback = (req: Request, res: Response, resolve: (value?: unknown) => void, reject: (reason?: any) => void, role: string[]) => async (err: any, user: User & { role: Roles } | undefined, info: any) => {
  if (err || info || !user) {
    res.status(httpStatus.UNAUTHORIZED).json({ status: true, data: null, error: true, message: 'Please authenticate' });
    return reject();
  }
  req.user = user;

  if (user && user?.role) {
    if (!role.includes(lowerCase(user.role))) {
      res.status(httpStatus.FORBIDDEN).json({ status: true, data: null, error: true, message: 'Forbidden' });
      return reject();
    }
  }

  resolve();
};

const authenticate =
  (role: string[] = ['user']) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, res, resolve, reject, role))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default authenticate;