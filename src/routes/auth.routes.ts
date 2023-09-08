import express from "express";
import { AuthController } from '../controllers/auth.controller'

//initiating the router
export const authRouter = express.Router()

//add user route
authRouter.post('/login', AuthController.loginUser);

authRouter.post('/logout', AuthController.logoutUser)

authRouter.post('/refresh', AuthController.refreshToken)
