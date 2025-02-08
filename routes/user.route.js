import express from 'express';
import { forgotPassword, login, register, resetPassword } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.post('/forgot_pass',forgotPassword);
userRouter.post('/reset_pass?',resetPassword);

export default userRouter;