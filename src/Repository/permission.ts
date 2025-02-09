import { first } from 'lodash';

import DB from '@/database'
import Permissions, { BodyUpdate } from '@/model/Permissions'

class PermissionRepository {
  static async getPermissions(): Promise<Permissions[]> {
    return await DB.getEntityManager().find(Permissions, {}, { limit: 20 });
  }
  static async getPermissionByOption(option: Partial<Permissions>): Promise<Permissions[]> {
    return await DB.getEntityManager().find(Permissions, option)
  }
  static async createPermission(name: string): Promise<Permissions | null> {
    const id = await DB.getEntityManager().insert(Permissions, { name });

    const permission = await this.getPermissionByOption({ id });

    return first(permission);
  }
  static async updatePermission(body: BodyUpdate): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      UPDATE Permissions
      SET name = ?
      WHERE id = ?
    `, [body.name, body.id]);
    
    return !!response;
  }
  static async deletePermission(id: number): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      DELETE FROM Permissions WHERE id = ?
    `, [id]);
    
    return !!response;
  }
}

export default PermissionRepository;
