import express from 'express';

import { ROLE } from '@/config/roles';
import validate from '@/middlewares/validate';
import StoreValidation from '@/validations/store';
import authenticate from '@/middlewares/authenticate';
import StoreController from '@/controller/v1/auth/store';

const router = express.Router();

router.get('/', validate(StoreValidation.getStores), StoreController.getStores);
router.post('/', validate(StoreValidation.createStore), StoreController.createStore);
router.patch('/:id', authenticate([ROLE.super]), validate(StoreValidation.updateStore), StoreController.updateStore);
router.delete('/:id', authenticate([ROLE.super]), validate(StoreValidation.deleteStore), StoreController.deleteStore);

export default router;
