import { Router } from 'express';

import { ROLE } from '@/config/roles';
import validate from '@/middlewares/validate';
import authenticate from '@/middlewares/authenticate';
import AuthenticationValidation from '@/validations/authentication';
import AuthenticationController from '@/controller/v1/user/authentication';

const router = Router();

router.get('/me', authenticate([ROLE.super, ROLE.admin, ROLE.moderator, ROLE.user]), AuthenticationController.me);
router.post('/registration', validate(AuthenticationValidation.register), AuthenticationController.register);
router.post('/login', validate(AuthenticationValidation.login), AuthenticationController.login);

export default router;
