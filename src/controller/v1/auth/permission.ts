import httpStatus from 'http-status-codes';

import catchAsync from '@/utils/catchAsync';
import PermissionService from '@/service/admin/permission';

class PermissionController {
  static getPermissions = catchAsync(async (_, res) => {
    const data = await PermissionService.getPermissions()
    res.status(httpStatus.OK).json(data)
  });
  static createPermission = catchAsync(async (req, res) => {
    const data = await PermissionService.createPermission(req.body.name)
    res.status(httpStatus.CREATED).json(data)
  });
  static updatePermission = catchAsync(async (req, res) => {
    const data = await PermissionService.updatePermission({ ...req.body, ...req.params })
    res.status(httpStatus.OK).json(data)
  });
  static deletePermission = catchAsync(async (req, res) => {
    const data = await PermissionService.deletePermission(Number(req.params.id))
    res.status(httpStatus.OK).json(data)
  });
}

export default PermissionController;
