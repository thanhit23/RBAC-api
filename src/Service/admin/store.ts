import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import UserRepository from "@/repository/user";
import StoreRepository from "@/repository/store";
import Stores, { BodyUpdate } from "@/model/Stores";
import { ResponseDefault } from '@/interfaces/response';

class StoreService {
  static async getStores(): Promise<ResponseDefault<Stores[]>> {
    const data = await StoreRepository.getStores();
    return { status: true, statusCode: httpStatus.OK, data, error: true, message: '' };
  }
  static async createStore(body: BodyUpdate): Promise<ResponseDefault<Stores | null>> {
    const user = await UserRepository.getUserByOption({ id: body.owner_id });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const data = await StoreRepository.createStore(body);

    return { status: true, error: false, data, message: 'Create Successfully' };
  }
  static async updateStore(userId: number, body: Required<BodyUpdate>): Promise<any> {
    const user = await UserRepository.getUserByOption({ id: userId });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not owner')
    }

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

    const isUpdated = await StoreRepository.updateStore(query, values);

    if (!isUpdated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Update Failled')
    }

    return { status: true, error: false, data: null, message: 'Update Successfully' }
  }
  static async deleteStore(userId: number, id: number): Promise<any> {
    const user = await UserRepository.getUserByOption({ id: userId });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not owner')
    }

    const isDeleted = await StoreRepository.deleteStore(id);

    if (!isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Delete Failled')
    }

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default StoreService;
