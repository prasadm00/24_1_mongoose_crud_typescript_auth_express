import { userServices } from '../helper/user.helper'
import { Request, Response } from 'express'
import { UserschemaValidate } from '../models/users/users.validate'
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


class userController {

    //add user controller
    addUser = async (req: Request, res: Response) => {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //data to be saved in database
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
            gender: req.body.gender,
            role: req.body.role
        }
        //validating the request
        const { error, value } = UserschemaValidate.validate(data)

        const userData = await userServices.getUserByEmail(data.email)
        if (userData) {
            return res.status(409).json({
                message: "User already exist.",
                success: false
            });
        }
        if (error) {
            console.log("Error", error);
            res.send(error.message)

        } else {
            //call the create user function in the service and pass the data from the request
            const user = await userServices.createUser(value)
            res.status(201).send(user)
        }

    }

    //get all users
    getUsers = async (req: Request, res: Response) => {
        let token = req.headers['authorization'] || '';
        let data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log("Inside getUsers");
        if (data.role === 'admin') {
            const users = await userServices.getUsers()
            return res.status(200).json({ users: users, success: true })
        }
        res.status(401).json({
            message: "Do not have required permissions.",
            success: false
        });
    }


    //get a single user
    getAUser = async (req: Request, res: Response) => {
        //get id from the parameter
        const id = req.params.id
        const user = await userServices.getUser(id)
        res.send(user)
    }

    loginUser = async (req: Request, res: Response) => {
        console.log("Inside login User");
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            console.log("Inside ");
            res.status(400).send("All input is required");
        }
        const userData = await userServices.getUserByEmail(email)
        console.log("🚀 ~ file: user.controller.ts:65 ~ userController ~ loginUser= ~ userData:", userData)
        //@ts-ignore
        if (!userData) {
            return res.status(401).json({
                message: "User doesnot exist.",
                success: false
            });
        }
        if (await bcrypt.compare(password, userData.password)) {
            const user = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                age: userData.age,
                gender: userData.gender,
                role: userData.role
            };

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '180s' });

            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || '');

            return res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user
            });
        } else {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

    }

    //update user
    updateUser = async (req: Request, res: Response) => {
        const id = req.params.id
        const user = await userServices.updateUser(id, req.body)
        res.send(user)
    }


    //delete a user
    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id
        await userServices.deleteUser(id)
        res.send('user deleted')
    }
}

//export class
export const UserController = new userController()