import { Router } from 'express';
import messageController from '../../domains/messages/controller/messageController.js';

const router = Router();

// GET
router.get('/', messageController.getMessages);

// GET
router.get('/:chatroomId', messageController.getMessagesByChatroomId)

// POST
router.post('/', messageController.createNewMessage);

// PUT
router.put('/:id', messageController.updateMessageById);

// DELETE
router.delete('/:id', messageController.deleteMessageById);

export default router;
