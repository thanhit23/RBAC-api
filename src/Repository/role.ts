import DB from '@/database'
import Roles, { BodyUpdate } from '@/model/Roles'

class RoleRepository {
  static async getRoles(): Promise<Roles[]> {
    return await DB.getEntityManager().find(Roles, {}, { limit: 20 });
  }

  static async getRoleByOption(option: Partial<Roles>): Promise<Roles | null> {
    return await DB.getEntityManager().findOne(Roles, option);
  }

  static async getRolesByOption(option: Partial<Roles>): Promise<Roles[]> {
    return await DB.getEntityManager().find(Roles, option);
  }
  static async createRole(body: BodyUpdate): Promise<Roles | null> {  
    const id = await DB.getEntityManager().insert(Roles, body);

    return await this.getRoleByOption({ id });
  }
  static async updateRole(query: string, values: (string | number)[]): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(query, values);

    return !!response;
  }
  static async deleteRole(id: number): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      DELETE FROM Roles WHERE id = ?
    `, [id]);
    
    return !!response;
  }
}

export default RoleRepository;
