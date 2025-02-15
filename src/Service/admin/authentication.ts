import { Request } from 'express';
import { first } from 'lodash';
import httpStatus from 'http-status-codes';

import Users from '@/model/Users';
import ApiError from '@/utils/ApiError';
import { ROLE_NUMBER } from '@/constants';
import UntilService from '@/service/until';
import RoleRepository from "@/repository/role";
import UserRepository from '@/repository/user';
import UserRoleRepository from '@/repository/userRole';

class AuthenticationService {
  static async registerAdmin(req: Request) {
    const role = await RoleRepository.getRoleByOption({ id: req.body.roleId });

    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
    }

    const isEmailExist = await UserRepository.checkEmailExist(req.body.email);

    if (isEmailExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const user = req?.user as Users;

    const query = `
      SELECT * FROM UserRoles LEFT JOIN Roles ON UserRoles.role_id = Roles.id WHERE UserRoles.user_id = ?
    `;

    const usersWithRoles = await UserRoleRepository.executeUserRoleQuery(query, [user.id]);
        
    if (first(usersWithRoles).role_id === ROLE_NUMBER.MODERATOR && req.body.roleId === ROLE_NUMBER.ADMIN) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating user');
    }

    const password = await UntilService.hashPassword(req.body.password);

    const userInsert = await UserRepository.createUser({...req.body, password, roleId: role!.id });

    return { status: true, error: false, data: userInsert, message: 'Create Successfully' };
  }
}

export default AuthenticationService;
