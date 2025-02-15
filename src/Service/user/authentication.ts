import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import UntilService from "@/service/until";
import { RegisterBody } from '@/model/Users';
import UserRepository from '@/repository/user';
import RoleRepository from '@/repository/role';

class AuthenticationService {
  static async register(body: RegisterBody) {
    const isEmailExist = await UserRepository.checkEmailExist(body.email);

    if (isEmailExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const password = await UntilService.hashPassword(body.password);

    const role = await RoleRepository.getRoleByOption({ id: body?.roleId });

    if (!role) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Role Not Found');
    }

    const user = await UserRepository.createUser({ ...body, password, roleId: role!.id });

    const token = await UntilService.generateAuthTokens(user);

    return { status: true, error: false, data: token, message: 'Create Successfully' };
  }
  static async login(body: RegisterBody) {
    const isEmailExist = await UserRepository.checkEmailExist(body.email);

    if (!isEmailExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const user = await UserRepository.getUserByOption({ email: body.email });

    const checkPassword = await UntilService.comparePassword(body.password, user?.password || '')

    if (user && !checkPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email or password not correct');
    }

    const token = await UntilService.generateAuthTokens(user!);

    return { status: true, error: false, data: token, message: 'Login Successfully' };
  }
}

export default AuthenticationService;
