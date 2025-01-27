import { Request } from 'express';

import RoleRepository from "@/repository/role";
import AuthenticationRepository from "@/repository//admin/authentication";

class AuthenticationService {
  static async registerAdmin(req: Request) {
    await RoleRepository.validateRole(req.body.roleId);

    return await AuthenticationRepository.register(req);
  }
}

export default AuthenticationService;
