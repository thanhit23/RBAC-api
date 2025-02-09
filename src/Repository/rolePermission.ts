import httpStatus from 'http-status-codes'

import DB from '@/database'
import Roles from '@/model/Roles'
import ApiError from '@/utils/ApiError'
import Permissions from '@/model/Permissions'
import RolePermissions, { BodyUpdate } from '@/model/RolePermissions'

class RolePermissionRepository {
  static async getRolePermissions(): Promise<RolePermissions[]> {
    return await DB.getEntityManager().find(RolePermissions, {}, { limit: 20, offset: 0 });
  }
  static async getRolePermissionByOption(option: Partial<RolePermissions>): Promise<RolePermissions | null> {
    return await DB.getEntityManager().findOne(RolePermissions, option);
  }

  static async getRolePermissionsByOption(option: Partial<RolePermissions>): Promise<RolePermissions[]> {
    return await DB.getEntityManager().find(RolePermissions, option);
  }

  static async validateRoleAndPermission(body: BodyUpdate): Promise<void> {
    const role = await DB.getEntityManager().findOne(Roles, { id: body.role_id });
    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.')
    }

    const permission = await DB.getEntityManager().findOne(Permissions, { id: body.permission_id });
    if (!permission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found.')
    }
  }

  static async createRolePermission(body: BodyUpdate): Promise<RolePermissions | null> {
    const id = await DB.getEntityManager().insert(RolePermissions, body);

    return await this.getRolePermissionByOption({ id });
  }

  static async updateRolePermission(body: Required<BodyUpdate>): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      UPDATE Role_Permissions
      SET role_id = ?, permission_id = ?
      WHERE id = ?
    `, [body.role_id, body.permission_id, body.id]);
    
    return !!response;
  }

  static async deleteRolePermission(id: number): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      DELETE FROM Role_Permissions WHERE id = ?
    `, [id]);
        
    return !!response;
  }
}

export default RolePermissionRepository;
