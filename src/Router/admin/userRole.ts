import express from 'express';

import validate from '@/middlewares/validate';
import UserRoleController from '@/controller/v1/auth/userRole';
import UserRoleValidation from '@/validations/userRole';

const router = express.Router();

router.get('/', validate(UserRoleValidation.getUserRoles), UserRoleController.getUserRoles);
router.post('/', validate(UserRoleValidation.createUserRole), UserRoleController.createUserRole);
router.patch('/:id', validate(UserRoleValidation.updateUserRole), UserRoleController.updateUserRole);
router.delete('/:id', validate(UserRoleValidation.deleteUserRole), UserRoleController.deleteUserRole);

export default router;
