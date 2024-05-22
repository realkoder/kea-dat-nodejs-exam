import express from 'express';
import messageService from '../service/messageService.js';

const { Request, Response, NextFunction } = express;

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
async function createNewMessage(req, res, next) {  
  try {
    const newCreatedMessage = await messageService.createNewMessage(req.body);
    if (!newCreatedMessage) return res.status(400).send({ message: 'Could not create new message' });

    return res.status(200).send({
      info: 'Successfully created new message',
      message: newCreatedMessage,
    });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) { 
  try {
    const messages = await messageService.getMessages();

    return res.status(200).send({
      info: 'Successfully fetched messages',
      message: messages,
    });
  } catch (error) {
    next(error);
  }
}

async function getMessagesByChatroomId(req, res, next) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    const messages = await messageService.getMessagesByChatroomId(req.params.chatroomId, page, limit);
    
    return res.status(200).send({
      info: 'Successfully fetched messages by chatroomId',
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMessageById(req, res, next) {
  try {
    const updatedMessage = await messageService.updateMessageById(req.params.id, req.body);
    if (!updatedMessage) return res.status(404).send({ message: 'Message not found' });
    res.status(200).send({ message: 'Message updated successfully' });
  } catch (error) {}
}

async function deleteMessageById(req, res, next) { 
  try {
    const deletionResult = await messageService.deleteMessageById(req.params.id);
    if (deletionResult) {
      res.status(200).send({ message: 'Message deleted successfully' });
    } else {
      res.status(404).send({ message: 'Message not found' });
    }
  } catch (error) {
    next(error);
  }
}

export default {
  createNewMessage,
  getMessages,
  getMessagesByChatroomId,
  updateMessageById,
  deleteMessageById,
};
