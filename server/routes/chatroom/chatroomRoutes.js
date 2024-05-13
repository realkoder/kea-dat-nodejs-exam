import { Router } from 'express';
import chatroomController from '../../domains/chatrooms/controller/chatroomController.js';

const router = Router();

// GET
router.get('/:id', chatroomController.findByIdPopulatedWithMessages);

// POST
router.post('/', chatroomController.createNewChatroom);

// PUT
router.put('/:id', chatroomController.updateChatroomById);

// DELETE
router.delete('/:id', chatroomController.deleteChatroomById);

export default router;
