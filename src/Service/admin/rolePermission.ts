import { isEmpty } from 'lodash';
import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import RoleRepository from '@/repository/role';
import { BodyUpdate } from "@/model/RolePermissions";
import { ResponseDefault } from '@/interfaces/response';
import PermissionRepository from "@/repository/permission";
import RolePermissionRepository from "@/repository/rolePermission";

class RolePermissionService {
  static async getRolePermissions(): Promise<any> {
    const entities = await RolePermissionRepository.getRolePermissions();
    return { status: true, statusCode: httpStatus.OK, data: entities, error: true, message: '' };
  }
  static async validateRoleAndPermission(body: BodyUpdate): Promise<void> {
    const role = await RoleRepository.getRoleByOption({ id: body.role_id });

    if (isEmpty(role)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.')
    }

    const permission = await PermissionRepository.getPermissionByOption({ id: body.permission_id });

    if (isEmpty(permission)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found.')
    }
  }
  static async createRolePermission(body: BodyUpdate): Promise<any> {
    await this.validateRoleAndPermission(body);

    const rolePermission = await RolePermissionRepository.createRolePermission(body);

    return { status: true, error: false, data: rolePermission, message: 'Create Successfully' }
  }
  static async updateRolePermission(body: Required<BodyUpdate>): Promise<ResponseDefault<null>> {
    await this.validateRoleAndPermission(body);

    const isUpdated = await RolePermissionRepository.updateRolePermission(body);

    if (!isUpdated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Update failed')
    }

    return { status: true, statusCode: httpStatus.OK, error: false, data: null, message: 'Update Successfully' }
  }
  static async deleteRolePermission(id: number): Promise<any> {
    const rolePermission = await RolePermissionRepository.getRolePermissionByOption({ id });
    
    if (!rolePermission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found.')
    }

    const isDeleted = await RolePermissionRepository.deleteRolePermission(id);
   
    if (!isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Delete failed.')
    }

    return { status: true, statusCode: httpStatus.OK, error: false, data: null, message: 'Delete Successfully.' }
  }
}

export default RolePermissionService;
