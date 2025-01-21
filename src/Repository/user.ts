import { first, isEmpty } from 'lodash';
import httpStatus from 'http-status-codes';

import DB from '@/database';
import Users from '@/model/Users';
import { ROLE } from '@/config/roles';
import ApiError from '@/utils/ApiError';
import UserRoles from '@/model/UserRoles';
import { ResponseDefault } from '@/interfaces/response';

type UserRow = Users & {
  role_id: number,
  role_name: string,
}

type NewUser = Omit<Users, 'password'> & { roles: { id: number; name: string }[] };

class UserRepository {
  static async getUsers(): Promise<ResponseDefault<Users[]>> {
    const usersWithRoles = await DB.getEntityManager().getConnection().execute(`
      SELECT
        u.id AS id,
        u.name AS name,
        u.email AS email,
        r.id AS role_id,
        r.name AS role_name
      FROM
        Users u
      LEFT JOIN
        UserRoles ur ON u.id = ur.user_id
      LEFT JOIN
        Roles r ON ur.role_id = r.id
    `);

    const result = usersWithRoles.reduce((acc: NewUser[], row: UserRow) => {
      const user = acc.find(u => u.id === row.id);
      if (!user) {
        acc.push({
          id: row.id,
          name: row.name,
          email: row.email,
          roles: row.role_id ? [{ id: row.role_id, name: row.role_name }] : [],
        });
      } else if (row.role_id) {
        user.roles.push({ id: row.role_id, name: row.role_name });
      }

      return acc;
    }, []);
    
    return { status: true, statusCode: httpStatus.OK, data: result, error: true, message: '' };
  }
  static async validateOwnerForStore(id: number): Promise<void> {
    const em = DB.getEntityManager().fork();
    const user = await em.findOne(Users, { id });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not owner')
    }
  }
  static async validateUser(id: number): Promise<void> {
    const user = await DB.getEntityManager().findOne(Users, { id });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found.');
    }
  }
  static async deleteUser(id: number, user: any): Promise<ResponseDefault<any>> {
    const em = DB.getEntityManager().fork();
    const userEntity = await DB.getEntityManager().findOne(Users, { id });
    
    const userRoles = await DB.getEntityManager().getConnection().execute(`
      SELECT UserRoles.id AS id, Roles.name AS name
      FROM UserRoles
      LEFT JOIN Roles ON Roles.id = UserRoles.role_id
      WHERE user_id = ?
      LIMIT 1;
    `, [id]);

    if (isEmpty(userRoles) || !userEntity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found.');
    }

    const userRoleName = first(userRoles).name;

    const userRoleEntity = await DB.getEntityManager().findOne(UserRoles, { id: first(userRoles).id });

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

    if (userRoleEntity) {
      await em.removeAndFlush(userRoleEntity);
    }

    await em.removeAndFlush(userEntity);

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default UserRepository;
