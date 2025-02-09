import express from 'express';

import validate from '@/middlewares/validate';
import RoleValidation from '@/validations/role';
import RoleController from '@/controller/v1/auth/role';

const router = express.Router();

router.get('/', validate(RoleValidation.getRoles), RoleController.getRoles);
router.post('/', validate(RoleValidation.createRole), RoleController.createRole);
router.patch('/:id', validate(RoleValidation.updateRole), RoleController.updateRole);
router.delete('/:id', validate(RoleValidation.deleteRole), RoleController.deleteRole);

export default router;
