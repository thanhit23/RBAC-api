import { omit } from 'lodash';
import httpStatus from 'http-status-codes';

import ApiError from '@/utils/ApiError';
import UntilService from "@/service/until";
import RoleRepository from '@/repository/role';
import UserRepository from '@/repository/user';
import { RegisterBody } from '@/model/Users';
import UserRoleRepository from '@/repository/userRole';

class AuthenticationService {
  static async register(body: RegisterBody) {
    const isEmailExist = await UserRepository.checkEmailExist(body.email);

    if (isEmailExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
    }

    const password = await UntilService.hashPassword(body.password);

    const user = await UserRepository.createUser(omit({...body, password}, ['roleId']));

    const role = await RoleRepository.getRoleByOption({ id: body?.roleId });

    await UserRoleRepository.createUserRole({
      role_id: role!.id,
      user_id: user.id,
    })

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
