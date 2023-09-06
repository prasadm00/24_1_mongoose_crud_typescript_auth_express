import express from "express";
import { UserController } from '../controllers/user.controller'
import { authenticateToken } from '../middleware/auth.middleware'

//initiating the router
export const userRouter = express.Router()

//add user route
userRouter.post('/', UserController.addUser)

//get users
userRouter.get('/', authenticateToken, UserController.getUsers)

//get single user
userRouter.get('/:id', authenticateToken, UserController.getAUser)

//update a user
userRouter.put('/:id', authenticateToken, UserController.updateUser)

//delete a user
userRouter.delete('/:id', authenticateToken, UserController.deleteUser)
