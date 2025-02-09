import { isEmpty } from 'lodash';

import DB from '@/database';
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
    const userId = await DB.getEntityManager().insert(Users, body);
    const user = await DB.getEntityManager().findOne(Users, { id: userId })
    return user!;
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
    try {
      const response = await DB.getEntityManager().getConnection().execute(`
        DELETE FROM Users WHERE id = ?
      `, [id]);
      
      return !!response;
    } catch (error) {
      console.log('response', error);
      return false;
    }
  }
}

export default UserRepository;
