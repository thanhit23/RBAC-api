import { isEmpty, omit } from 'lodash';
import httpStatus from 'http-status-codes';

import DB from '@/database';
import ApiError from '@/utils/ApiError';
import UserRoleRepository from './userRole';
import Users, { RegisterBody } from '@/model/Users';

type UserRow = Users & {
  role_id: number,
  role_name: string,
}

type NewUser = Omit<Users, 'password'> & { roles: { id: number; name: string }[] };

class UserRepository {
  static async checkEmailExist(email: string) {
    const users = await DB.getEntityManager().find(Users, { email })
    return !isEmpty(users);
  }
  static async createUser(body: RegisterBody): Promise<Users> {
    const transaction = DB.getEntityManager();

    try {
      await transaction.begin();
      const userId = await DB.getEntityManager().insert(Users, omit(body, ['roleId']));

      const user = await DB.getEntityManager().findOne(Users, { id: userId })
  
      await UserRoleRepository.createUserRole({
        role_id: body!.roleId,
        user_id: user!.id,
      })
  
      await transaction.commit();

      return user!;
    } catch (err: { statusCode: number; message: string } | any) {
      await transaction.rollback();

      console.log(err);

      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
  static async getUsers(): Promise<Users[]> {
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

    return usersWithRoles.reduce((acc: NewUser[], row: UserRow) => {
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
  }
  static async getUsersByOption(option: Partial<Users>): Promise<Users[]> {
    return await DB.getEntityManager().find(Users, option);
  }
  static async getUserByOption(option: Partial<Users>): Promise<Users | null> {
    return await DB.getEntityManager().findOne(Users, option);
  }
  static async deleteUser(id: number): Promise<boolean> {
    const transaction = DB.getEntityManager();
    
    try {
      await transaction.begin();

      const query = `DELETE FROM UserRoles WHERE user_id = ?`;
    
      await UserRoleRepository.executeUserRoleQuery(query, [id]);
      
      const response = await DB.getEntityManager().getConnection().execute(`
        DELETE FROM Users WHERE id = ?
      `, [id]);

      await transaction.commit();
      
      return !!response;
    } catch (error) {
      await transaction.rollback();

      console.log('error', error);
      return false;
    }
  }
}

export default UserRepository;
