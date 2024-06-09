import 'dotenv/config';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import {
  renderEmailTemplate,
  requestPasswordResetEmailTemplate,
  passwordUpdatedEmailTemplate,
  signupEmailTemplate,
} from '../../../utils/loadEmailTemplates.js';
import { capitalizeName } from '../../../utils/utilsFunctions.js';
import UserRepository from '../../users/repository/UserRepository.js';
import LoginRepository from '../repository/loginRepository.js';
import prefixedLogger from '../../../utils/logger.js';

const resend = new Resend(process.env.RESEND_API);

const serviceLogger = prefixedLogger('🔧 [Service]: ');
const saltRounds = 14;

async function createNewUserWithLogin({ name, email, username, password, secretPhrase }) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedSecretPhrase = await bcrypt.hash(secretPhrase, saltRounds);
    const verificationCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();

    return UserRepository.create({ name, email })
      .then(createdUserId =>
        LoginRepository.create({
          _id: createdUserId,
          username,
          password: hashedPassword,
          secretPhrase: hashedSecretPhrase,
          verificationCode,
          isVerified: false,
        }),
      )
      .then(createdLogin => {
        serviceLogger.info(`Login created successfully for user: ${username}`);
        const verificationCodeText = `Your verification code: ${verificationCode}`;

        const emailTemplate = renderEmailTemplate(signupEmailTemplate, {
          name: capitalizeName(name),
          clickLink: process.env.NODE_ENV
            ? `https://kea-exam.intellioptima.com/verification/${createdLogin.username}`
            : `http://localhost:3000/verification/${createdLogin.username}`,
          verificationCode: verificationCodeText,
        });

        resend.emails
          .send({
            from: 'info@intellioptima.com',
            to: [`${email}`],
            subject: 'Welcome to IntelliOptima',
            html: emailTemplate,
          })
          .then(data => serviceLogger.info(`Email sent with data: ${data}`));

        return createdLogin;
      })
      .catch(error => {
        serviceLogger.error(`Error in creating login: ${error} `);
        throw error;
      });
  } catch (error) {
    serviceLogger.error(`Error hashing password or creating user: ${error}`);
    throw error;
  }
}

function loginWithCredentials({ username, password }) {
  return LoginRepository.findByUsername(username)
    .then(foundUser => {
      if (!foundUser) {
        serviceLogger.info(`No login found for username: ${username}`);
        return null; // Return null if no user is found
      }

      return bcrypt.compare(password, foundUser.password).then(matchingPasswords => {
        if (matchingPasswords) {
          return foundUser; // Return the found user if passwords match
        }
        serviceLogger.info('Passwords for user did not match');
        return null; // Return null if passwords do not match
      });
    })
    .catch(error => {
      throw error;
    });
}

function getLogin(username) {
  return LoginRepository.findByUsername(username)
    .then(foundUser => {
      if (!foundUser) {
        serviceLogger.info(`No login found for username: ${username}`);
        return null; // Return null if no user is found
      }
      return foundUser;
    })
    .catch(error => {
      throw error;
    });
}

function findUserById(userId) {
  return LoginRepository.findUserById(userId)
    .then(foundUser => {
      if (!foundUser) {
        serviceLogger.info('No login found for user');
        return null; // Return null if no user is found
      }
      return foundUser;
    })
    .catch(error => {
      throw error;
    });
}

async function setIsVerified(loginId) {
  serviceLogger.info(`Updating login isVerifed with id: ${loginId}`);
  return LoginRepository.setIsVerified(loginId);
}

async function resetPassword(user, newPassword, secretPhrase, userLogin) {
  if (await bcrypt.compare(secretPhrase, userLogin.secretPhrase)) {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    return LoginRepository.updateLogin(userLogin._id, hashedPassword) // Pass the userId and hashed password correctly
      .then(updatedLogin => {
        if (!updatedLogin) {
          serviceLogger.info("Login couldn't be updated");
          return null;
        }
        const emailTemplate = renderEmailTemplate(passwordUpdatedEmailTemplate, {
          name: capitalizeName(user.name),
          clickLink: 'http://localhost:3000/',
        });
        const { data, error } = resend.emails
          .send({
            from: 'info@intellioptima.com',
            to: [`${user.email}`],
            subject: 'Password Updated',
            html: emailTemplate,
          })
          .then(data => serviceLogger.info(`Email sent with data: ${data}`));
        return updatedLogin;
      })
      .catch(error => {
        throw error;
      });
  }
  throw new Error('Secret phrase does not match');
}

async function sendEmailForPasswordReset(user) {
  const emailTemplate = renderEmailTemplate(requestPasswordResetEmailTemplate, {
    name: capitalizeName(user.name),
    clickLink: 'http://localhost:3000/reset-password', // NODE_ENV === 'production' ? Deployed domain link
  });
  const { data, error } = await resend.emails.send({
    from: 'info@intellioptima.com',
    to: [`${user.email}`],
    subject: 'Password Reset Request',
    html: emailTemplate,
  });

  return data;
}

function logoutUser(req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  serviceLogger.info('User logged out, and cleared tokens');

  return { message: 'User logged out successfully' };
}

export default {
  createNewUserWithLogin,
  loginWithCredentials,
  getLogin,
  findUserById,
  setIsVerified,
  resetPassword,
  sendEmailForPasswordReset,
  logoutUser,
};
