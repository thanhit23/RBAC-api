import httpStatus from 'http-status-codes';

import catchAsync from '@/utils/catchAsync';
import RolePermissionService from '@/service/admin/rolePermission'

class RolePermissionController {
  static getRolePermissions = catchAsync(async (_, res) => {
    const data = await RolePermissionService.getRolePermissions()
    res.status(httpStatus.CREATED).json(data)
  });

  static createRolePermission = catchAsync(async (req, res) => {
    const data = await RolePermissionService.createRolePermission(req.body)
    res.status(httpStatus.CREATED).json(data)
  });

  static updateRolePermission = catchAsync(async (req, res) => {
    const data = await RolePermissionService.updateRolePermission({ ...req.body, ...req.params })
    res.status(httpStatus.CREATED).json(data)
  });

  static deleteRolePermission = catchAsync(async (req, res) => {
    const data = await RolePermissionService.deleteRolePermission(Number(req.params.id))
    res.status(httpStatus.CREATED).json(data)
  });
}

export default RolePermissionController;
