import express from 'express';

import { ROLE } from '@/config/roles';
import validate from '@/middlewares/validate';
import authenticate from '@/middlewares/authenticate';
import AuthenticationValidation from '@/validations/authentication';
import AuthenticationController from '@/controller/v1/auth/authentication';

const router = express.Router();

router.post(
  '/registration',
  authenticate([ROLE.super, ROLE.admin, ROLE.moderator]),
  validate(AuthenticationValidation.register),
  AuthenticationController.registerAdmin
);

export default router;
