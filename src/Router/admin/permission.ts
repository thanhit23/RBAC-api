import express from 'express';
import PermissionController from '@/controller/v1/auth/permission';
import validate from '@/middlewares/validate';
import PermissionValidation from '@/validations/permission';

const router = express.Router();

router.get('/', validate(PermissionValidation.getPermissions), PermissionController.getPermissions);
router.post('/', validate(PermissionValidation.createPermission), PermissionController.createPermission);
router.patch('/:id', validate(PermissionValidation.updatePermission), PermissionController.updatePermission);
router.delete('/:id', validate(PermissionValidation.deletePermission), PermissionController.deletePermission);

export default router;
