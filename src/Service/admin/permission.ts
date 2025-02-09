import { isEmpty } from 'lodash';
import httpStatus from 'http-status-codes'

import ApiError from '@/utils/ApiError';
import { BodyUpdate } from "@/model/Permissions";
import PermissionRepository from "@/repository/permission";

class PermissionService {
  static async getPermissions(): Promise<any> {
    const permissions = await PermissionRepository.getPermissions();

    return { status: true, data: permissions, error: true, message: '' };
  }
  static async createPermission(name: string): Promise<any> {
    const permissionExist = await PermissionRepository.getPermissionByOption({ name })

    if (!isEmpty(permissionExist)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Permission already exists')
    }

    const permission = await PermissionRepository.createPermission(name)
    
    return { status: true, error: false, data: permission, message: 'Create Successfully' }
  }
  static async updatePermission(body: BodyUpdate): Promise<any> {
    const permission = await PermissionRepository.getPermissionByOption({ id: body.id })

    if (!permission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found.')
    }

    const isUpdated = await PermissionRepository.updatePermission(body);

    if (!isUpdated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Update Failled')
    }

    return{ status: true, error: false, data: null, message: 'Update Successfully' }
  }
  static async deletePermission(id: number): Promise<any> {
    const permission = await PermissionRepository.getPermissionByOption({ id })

    if (isEmpty(permission)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found.')
    }

    const isDeleted = await PermissionRepository.deletePermission(id);

    if (!isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Delete Failled')
    }

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default PermissionService;
