import DB from '@/database'
import UserRole, { Body } from '@/model/UserRoles'

class UserRoleRepository {
  static async getUserRoles(): Promise<UserRole[]> {
    return await DB.getEntityManager().find(UserRole, {}, { limit: 20 });
  }
  static async getUserRoleByOption(option: Partial<UserRole>): Promise<UserRole | null> {
    return await DB.getEntityManager().findOne(UserRole, option);
  }
  static async executeUserRoleQuery(query: string, values: (string | number)[]): Promise<UserRole[]> {
    return await DB.getEntityManager().getConnection().execute(query, values);
  }
  static async getUserRole(option: Partial<UserRole>): Promise<UserRole> {
    const role = await DB.getEntityManager().findOne(UserRole, option);
    return role as UserRole;
  }
  static async createUserRole(body: Body): Promise<UserRole> {
    const userRole = await DB.getEntityManager().insert(UserRole, body);

    return this.getUserRole({ id: userRole });
  }
  static async updateUserRole(query: string, values: (string | number)[]): Promise<boolean> {

    const response = await DB.getEntityManager().getConnection().execute(query, values);
    
    return !!response;
  }
  static async deleteUserRole(id: number): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      DELETE FROM UserRoles WHERE id = ?
    `, [id]);
    
    return !!response;
  }
}

export default UserRoleRepository;
