import bcrypt from 'bcrypt';
import { Request } from 'express';
import { first } from 'lodash';
import httpStatus from 'http-status-codes';

import DB from '@/database'
import Users from '@/model/Users'
import UserRole from '@/model/UserRoles'
import ApiError from '@/utils/ApiError';
import { ROLE_NUMBER } from '@/constants';

import RoleRepository from '../role';

class UserRepository {
  static async register(req: Request) {
    const users = await DB.getEntityManager().find(Users, { email: req.body.email })

    if (users.length > 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const user = req?.user as Users;

    const usersWithRoles = await DB.getEntityManager().getConnection().execute(`
      SELECT * FROM UserRoles LEFT JOIN Roles ON UserRoles.role_id = Roles.id WHERE UserRoles.user_id = ?
    `, [user.id!])
    
    if (first(usersWithRoles).role_id === ROLE_NUMBER.MODERATOR && req.body.roleId === ROLE_NUMBER.ADMIN) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Error creating user');
    }

    const password = bcrypt.hashSync(req.body.password, 10);

    const userId = await DB.getEntityManager().insert(Users, {
      name: req.body.name,
      email: req.body.email,
      password,
    })

    const role = await RoleRepository.getRoleById(req.body.roleId);

    await DB.getEntityManager().insert(UserRole, {
      role_id: role.id,
      user_id: userId,
    });

    return { status: true, error: false, data: true, message: 'Create Successfully' }
  }
}

export default UserRepository;
