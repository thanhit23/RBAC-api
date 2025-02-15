import DB from '@/database';
import Stores, { BodyUpdate } from "@/model/Stores";

class StoreRepository {
  static async getStores(): Promise<Stores[]> {
    return await DB.getEntityManager().find(Stores, {}, { limit: 20 });
  }
  static async createStore(body: BodyUpdate): Promise<Stores | null> {  
    const id = await DB.getEntityManager().insert(Stores, body);
    return await this.getStoreByOption({ id });
  }
  static async getStoreByOption(option: Partial<Stores>): Promise<Stores | null> {  
    return await DB.getEntityManager().findOne(Stores, option);
  }
  static async getStoresByOption(option: Partial<Stores>): Promise<Stores[]> {  
    return await DB.getEntityManager().find(Stores, option);
  }
  static async updateStore(body: Required<BodyUpdate>): Promise<boolean> {

    const values: (string | number)[] = [];
    const updateFields: (string | number)[] = [];

    if (body.name) {
      updateFields.push('name = ?');
      values.push(body.name);
    }

    if (body.address) {
      updateFields.push('address = ?');
      values.push(body.address);
    }

    if (body.owner_id) {
      updateFields.push('owner_id = ?');
      values.push(body.owner_id);
    }

    values.push(body.id);

    const query = `UPDATE Stores SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const response = await DB.getEntityManager().getConnection().execute(query, values);
  
    return !!response;
  }
  static async deleteStore(id: number): Promise<boolean> {
    const response = await DB.getEntityManager().getConnection().execute(`
      DELETE FROM Stores WHERE id = ?
    `, [id]);
    
    return !!response;
  }
}

export default StoreRepository;
