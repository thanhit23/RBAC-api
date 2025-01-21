import express from 'express';
import UserController from '@/controller/v1/user';
import validate from '@/middlewares/validate';
import UserValidation from '@/validations/user';
import authenticate from '@/middlewares/authenticate';
import { ROLE } from '@/config/roles';

const router = express.Router();

router.get('/', validate(UserValidation.getUsers), UserController.getUsers);
router.delete('/:id', authenticate([ROLE.super, ROLE.admin, ROLE.moderator]), validate(UserValidation.deleteUser), UserController.deleteUser);

export default router;
