import httpStatus from 'http-status-codes';

import catchAsync from '@/utils/catchAsync';
import UserRoleService from '@/service/admin/userRole';

class UserRoleController {
  static getUserRoles = catchAsync(async (_, res) => {
    const data = await UserRoleService.getUserRoles()
    res.status(httpStatus.CREATED).json(data)
  });

  static createUserRole = catchAsync(async (req, res) => {
    const data = await UserRoleService.createUserRole(req.body)
    res.status(httpStatus.CREATED).json(data)
  });

  static updateUserRole = catchAsync(async (req, res) => {
    const data = await UserRoleService.updateUserRole({ ...req.body, ...req.params })
    res.status(httpStatus.CREATED).json(data)
  });

  static deleteUserRole = catchAsync(async (req, res) => {
    const data = await UserRoleService.deleteUserRole(Number(req.params.id))
    res.status(httpStatus.CREATED).json(data)
  });
}

export default UserRoleController;
