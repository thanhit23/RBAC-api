import { omit } from 'lodash';
import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';

import AuthenticationService from '@/service/authentication'
import catchAsync from '@/utils/catchAsync';

class AuthenticationController {
  static register = catchAsync(async (req, res) => {
    const data = await AuthenticationService.register(req.body)
    res.status(httpStatus.OK).json(data)
  });
  static login = catchAsync(async (req, res) => {
    const data = await AuthenticationService.login(req.body)
    res.status(httpStatus.OK).json(data)
  })
  static async me(req: Request, res: Response): Promise<void> {
    if (!req?.user) {
      res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found'
      })
    }

    res.status(httpStatus.OK).json({
      user: omit(req?.user, ['password'])
    })
    return;
  }
}

export default AuthenticationController;
