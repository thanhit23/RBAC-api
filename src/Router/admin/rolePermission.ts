import express from 'express';

import validate from '@/middlewares/validate';
import RolePermissionValidation from '@/validations/rolePermission';
import RolePermissionController from '@/controller/v1/auth/rolePermission';

const router = express.Router();

router.get('/', validate(RolePermissionValidation.getRolePermissions), RolePermissionController.getRolePermissions);
router.post('/', validate(RolePermissionValidation.createRolePermission), RolePermissionController.createRolePermission);
router.patch('/:id', validate(RolePermissionValidation.updateRolePermission), RolePermissionController.updateRolePermission);
router.delete('/:id', validate(RolePermissionValidation.deleteRolePermission), RolePermissionController.deleteRolePermission);

export default router;
