import { first, isEmpty } from 'lodash';
import httpStatus from 'http-status-codes';

import User from "@/model/Users";
import { ROLE } from '@/config/roles';
import ApiError from '@/utils/ApiError';
import UserRepository from "@/repository/user";
import UserRoleRepository from "@/repository/userRole";
import { ResponseDefault } from "@/interfaces/response";

class UserService {
  static async getUsers(): Promise<ResponseDefault<User[]>> {
    const data = await UserRepository.getUsers();

    return { status: true, statusCode: httpStatus.OK, data, error: true, message: '' };
  }
  static async deteteUser(id: number, user: any): Promise<ResponseDefault<null>> {
    const userEntity = await UserRepository.getUserByOption({ id });

    if (!userEntity) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const userRoles = await UserRoleRepository.executeUserRoleQuery(`
      SELECT UserRoles.id AS id, Roles.name AS name
      FROM UserRoles
      LEFT JOIN Roles ON Roles.id = UserRoles.role_id
      WHERE user_id = ?
      LIMIT 1;
    `, [id])

    if (isEmpty(userRoles)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const userRoleName = first(userRoles).name;

    const userRoleEntity = await UserRoleRepository.getUserRole({ id: first(userRoles).id });

    const cannotDeleteRole = (targetRole: string, allowedRoles: string[]) => 
      userRoleName === targetRole && !allowedRoles.includes(user.role);

    if (cannotDeleteRole(ROLE.super, [ROLE.super])) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot delete a Super Admin.');
    }

    if (cannotDeleteRole(ROLE.admin, [ROLE.super])) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot delete an Admin.');
    }

    if (cannotDeleteRole(ROLE.moderator, [ROLE.super, ROLE.admin])) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot delete a Moderator.');
    }

    const query =`DELETE FROM UserRoles WHERE user_id = ?`;
    
    const isDeletedUserRole = await UserRoleRepository.executeUserRoleQuery(query, [userRoleEntity.user_id]);
    
    if (!isDeletedUserRole) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Delete failed.');
    }

    const isDeleted = await UserRepository.deleteUser(userRoleEntity.user_id);
    
    if (!isDeleted) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Delete failed.');
    }

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default UserService;
