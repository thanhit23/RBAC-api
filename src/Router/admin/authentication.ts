import express from 'express';
import AuthenticationController from '@/controller/auth/authentication';
import validate from '@/middlewares/validate';
import AuthenticationValidation from '@/validations/authentication';
import authenticate from '@/middlewares/authenticate';
import { ROLE } from '@/config/roles';

const router = express.Router();

router.post(
  '/registration',
  authenticate([ROLE.super, ROLE.admin, ROLE.moderator]),
  validate(AuthenticationValidation.register),
  AuthenticationController.registerAdmin
);

export default router;
