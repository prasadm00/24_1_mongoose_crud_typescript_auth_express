import express from "express";
// import { UserController } from '../controllers/user.controller'
import { AuthController } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'

//initiating the router
export const authRouter = express.Router()

//add user route
authRouter.post('/login', AuthController.loginUser);

authRouter.post('/logout', authenticateToken, AuthController.logoutUser)

authRouter.post('/refresh', AuthController.refreshToken)
