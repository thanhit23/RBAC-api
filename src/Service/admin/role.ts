import { isEmpty } from 'lodash'
import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import { BodyUpdate } from "@/model/Roles";
import RoleRepository from "@/repository/role";

class RoleService {
  static async getRoles(): Promise<any> {
    const roles = await RoleRepository.getRoles();
    return { status: true, statusCode: httpStatus.OK, data: roles, error: true, message: '' };
  }
  static async createRole(body: BodyUpdate): Promise<any> {
    const role = await RoleRepository.getRoleByOption({ name: body.name });

    if (!isEmpty(role)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Role already exists')
    }

    const data = await RoleRepository.createRole(body);

    return { status: true, error: false, data, message: 'Create Successfully' };
  }
  static async updateRole(body: Required<BodyUpdate>): Promise<any> {
    const role = await RoleRepository.getRoleByOption({ id: body.id });

    if (isEmpty(role)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.')
    }

    const isUpdated = await RoleRepository.updateRole(body);

    if (!isUpdated) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Update Failled')
    }

    return { status: true, error: false, data: null, message: 'Update Successfully' }
  }
  static async deleteRole(id: number): Promise<any> {
    const role = await RoleRepository.getRoleByOption({ id })

    if (isEmpty(role)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.')
    }

    const isDeleted = await RoleRepository.deleteRole(id);

    if (!isDeleted) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Delete Failled')
    }

    return { status: true, error: false, data: null, message: 'Delete Successfully', }
  }
}

export default RoleService;
