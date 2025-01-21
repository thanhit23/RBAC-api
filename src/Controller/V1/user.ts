import httpStatus from 'http-status-codes';

import UserService from '@/service/user'
import catchAsync from '@/utils/catchAsync';

class UserController {
  static getUsers = catchAsync(async (_, res) => {
    const data = await UserService.getUsers()
    res.status(httpStatus.CREATED).json(data)
  });

  static deleteUser = catchAsync(async (req, res) => {
    const data = await UserService.deteteUser(Number(req.params.id), req.user)
    res.status(httpStatus.CREATED).json(data)
  });
}

export default UserController;
