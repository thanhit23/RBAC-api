import express from 'express';
import AuthenticationController from '@/controller/auth/authentication';
import validate from '@/middlewares/validate';
import AuthenticationValidation from '@/validations/authentication';
import authenticate from '@/middlewares/authenticate';
import { ROLE } from '@/config/roles';

const router = express.Router();

router.get('/me', authenticate([ROLE.super, ROLE.admin, ROLE.moderator, ROLE.user]), AuthenticationController.me);
router.post('/register', validate(AuthenticationValidation.register), AuthenticationController.register);
router.post('/login', validate(AuthenticationValidation.login), AuthenticationController.login);

export default router;
