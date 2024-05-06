import { Router } from 'express';
import UserController from '../../domains/users/controller/userController.js';

const router = Router();

// GET
router.get('/:email', UserController.findUserByEmail);

// PUT
router.put('/:id', UserController.updateUserById);

// DELETE
router.delete('/:id', UserController.deleteUserById);

export default router;
