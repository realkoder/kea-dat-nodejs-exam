import express from 'express';
import chatroomService from '../service/chatroomService.js';

const { Request, Response, NextFunction } = express;

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
async function createNewChatroom(req, res, next) {
  try {
    const newCreatedChatroom = await chatroomService.createNewChatroom(req.body);
    if (!newCreatedChatroom) return res.status(400).send({ message: 'Could not create new chatroom' });

    return res.status(200).send({
      message: 'Successfully created new chatroom',
      chatroom: newCreatedChatroom,
    });
  } catch (error) {
    next(error);
  }
}

async function findByIdPopulatedWithMessages(req, res, next) {
  try {
    const foundChatroom = await chatroomService.findByIdPopulatedWithMessages(req.params.id);
    if (!foundChatroom) return res.status(400).send({ message: 'No chatroom found with provided id' });
    res.status(200).send({ data: foundChatroom });
  } catch (error) {
    next(error);
  }
}

async function updateChatroomById(req, res, next) {
  try {
    const updatedChatroom = await chatroomService.updateChatroomById(req.params.id, req.body);
    if (!updatedChatroom) return res.status(404).send({ message: 'Chatroom not found' });
    res.status(200).send({ message: 'Chatroom updated successfully' });
  } catch (error) {}
}

async function deleteChatroomById(req, res, next) {
  try {
    const deletionResult = await chatroomService.deleteChatroomById(req.params.id);
    if (deletionResult) {
      res.status(200).send({ message: 'Chatroom deleted successfully' });
    } else {
      res.status(404).send({ message: 'Chatroom not found' });
    }
  } catch (error) {
    next(error);
  }
}

export default {
  createNewChatroom,
  findByIdPopulatedWithMessages,
  updateChatroomById,
  deleteChatroomById,
};
