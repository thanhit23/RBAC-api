import httpStatus from 'http-status-codes';

import RoleService from '@/service/admin/role'
import catchAsync from '@/utils/catchAsync';

class RoleController {
  static getRoles = catchAsync(async (_, res) => {
    const data = await RoleService.getRoles()
    res.status(httpStatus.CREATED).json(data)
  });

  static createRole = catchAsync(async (req, res) => {
    const data = await RoleService.createRole(req.body)
    res.status(httpStatus.CREATED).json(data)
  });

  static updateRole = catchAsync(async (req, res) => {
    const data = await RoleService.updateRole({ ...req.body, ...req.params })
    res.status(httpStatus.CREATED).json(data)
  });

  static deleteRole = catchAsync(async (req, res) => {
    const data = await RoleService.deleteRole(Number(req.params.id))
    res.status(httpStatus.CREATED).json(data)
  });
}

export default RoleController;
