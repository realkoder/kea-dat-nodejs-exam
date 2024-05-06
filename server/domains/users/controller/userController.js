import express from 'express';
import UserService from '../service/UserService.js';

const { Request, Response, NextFunction } = express;

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */

const findUserByEmail = async (req, res, next) => {
  try {
    const foundUserByEmail = await UserService.findUserByEmail(req.params.email);
    if (!foundUserByEmail) return res.status(400).send({ message: 'No user found with ' });
    res.status(200).send({ data: foundUserByEmail });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updateUserById(req.params.id, req.body);
    if (!updatedUser) return res.status(404).send({ message: 'User not found' });
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {}
};

const deleteUserById = async (req, res, next) => {
  try {
    const deletionResult = await UserService.deleteUserById(req.params.id);
    if (deletionResult) {
      res.status(200).send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  findUserByEmail,
  deleteUserById,
  updateUserById,
};
