import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import UserRepository from "@/repository/user";
import RoleRepository from "@/repository/role";
import StoreRepository from "@/repository/store";
import UserRole, { Body } from '@/model/UserRoles';
import UserRoleRepository from "@/repository/userRole";
import { ResponseDefault } from '@/interfaces/response';

class UserRoleService {
  static async getUserRoles(): Promise<ResponseDefault<UserRole[]>> {
    const data = await UserRoleRepository.getUserRoles();
    return { status: true, statusCode: httpStatus.OK, data, error: true, message: '' };
  }
  static async createUserRole(body: Body): Promise<ResponseDefault<UserRole | null>> {
    const user = await UserRepository.getUserByOption({ id: body.user_id });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
    }

    if (body?.role_id) {
      const role = await RoleRepository.getRoleByOption({ id: body.role_id });

      if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
      }
    }

    if (body?.store_id) {
      const store = await StoreRepository.getStoreByOption({ id: body.role_id });

      if (!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Store not found.');
      }
    }

    const data = await UserRoleRepository.createUserRole(body);

    return { status: true, error: false, data, message: 'Create Successfully' };
  }
  static async updateUserRole(body: Required<Body>): Promise<any> {
    if (body?.user_id) {
      const user = await UserRepository.getUserByOption({ id: body.user_id });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
      }
    }

    if (body?.role_id) {
      const role = await RoleRepository.getRoleByOption({ id: body.role_id });

      if (!role) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
      }
    }

    if (body?.store_id) {
      const store = await StoreRepository.getStoreByOption({ id: body.role_id });

      if (!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Store not found.');
      }
    }

    return await UserRoleRepository.updateUserRole(body);
  }
  static async deleteUserRole(id: number): Promise<any> {
    const userRole = await UserRoleRepository.getUserRoleByOption({ id });

    if (!userRole) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Role not found.');
    }

    const isDeleted = await UserRoleRepository.deleteUserRole(id);

    if (!isDeleted) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Delete failed.');
    }

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default UserRoleService;
