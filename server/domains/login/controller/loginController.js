import express from 'express';

// Services
import LoginService from '../service/loginService.js';
import UserService from '../../users/service/UserService.js';

// Middlewares
import { loginMiddleware } from '../../../middlewares/auth/authMiddleware.js';

const { Request, Response, NextFunction } = express;

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const createNewUserWithLogin = async (req, res, next) => {
  try {
    const newCreatedUserWithLogin = await LoginService.createNewUserWithLogin(req.body);
    if (!newCreatedUserWithLogin) return res.status(400).send({ message: 'Could not create new user with login' });
    return res.status(200).send({
      message: 'Successfully created new user',
      user: { id: newCreatedUserWithLogin.id, username: newCreatedUserWithLogin.username },
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const loginWithCredentials = async (req, res, next) => {
  try {
    const userLogin = await LoginService.loginWithCredentials(req.body);
    if (!userLogin)
      return res.status(401).send({ message: 'Authentication failed. User not found or password incorrect.' });
    const jwtUserInfo = { id: userLogin.id, username: userLogin.username, isVerified: userLogin.isVerified };
    const tokens = loginMiddleware(jwtUserInfo);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 15 * 1000, // 15 seconds
      // sameSite: 'None',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // sameSite: 'None',
    });

    return res.status(200).send({
      message: 'Login successfull',
      user: { id: userLogin.id, username: userLogin.username },
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const verifyLoginAccount = async (req, res, next) => {
  try {
    const userLogin = await LoginService.getLogin(req.body.username);
    if (!userLogin) {
      return res.status(401).send({ message: 'Verification failed. User not found or verification code incorrect.' });
    }

    if (req.body.verificationCode !== userLogin.verificationCode) {
      return res.status(401).send({ message: 'Verification failed. User not found or verification code incorrect.' });
    }

    const verifiedLogin = await LoginService.setIsVerified(userLogin.id);
    if (!verifiedLogin) {
      return res.status(401).send({ message: 'Verification failed. User not found or verification code incorrect.' });
    }

    const jwtUserInfo = { id: userLogin.id, username: userLogin.username, isVerified: verifiedLogin.isVerified };
    const tokens = loginMiddleware(jwtUserInfo);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 15 * 1000, // 15 seconds
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).send({
      message: 'Verification successfull',
      user: { id: userLogin.id, username: userLogin.username },
    });
  } catch (error) {
    next(error);
  }
};

const resetPasswordForUser = async (req, res, next) => {
  const { secretPhrase, email, password } = req.body;
  try {
    const user = await UserService.findUserByEmail(email);
    const userLogin = await LoginService.findUserById(user.id);
    const newPasswordLogin = await LoginService.resetPassword(user, password, secretPhrase, userLogin);

    if (!newPasswordLogin) return res.status(500).send({ message: 'Internal Server Error' });
    return res.status(200).send({ data: 'Success, password resetted' });
  } catch (error) {
    next(error);
  }
};

const sendEmailForPasswordReset = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const user = await UserService.findUserByEmail(email);
    const loginForUser = await LoginService.getLogin(username);

    if (!loginForUser) return res.status(400).send({ data: 'Unable to process password reset request' });
    const response = await LoginService.sendEmailForPasswordReset(user);

    if (!response) return res.status(500).send({ data: 'Internal Server Error' });
    return res.status(200).send({ data: 'Success, email with info sent' });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const isLoggedIn = async (req, res, next) => res.status(200).send({ data: 'Authenticated' });

const logout = async (req, res, next) => {
  try {
    const logoutResponse = LoginService.logoutUser(req, res);
    res.status(200).send(logoutResponse);
  } catch (error) {
    next(error);
  }
};

export default {
  createNewUserWithLogin,
  loginWithCredentials,
  verifyLoginAccount,
  resetPasswordForUser,
  sendEmailForPasswordReset,
  isLoggedIn,
  logout,
};
