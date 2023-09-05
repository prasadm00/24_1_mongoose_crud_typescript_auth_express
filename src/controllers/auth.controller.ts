import { userServices } from '../helper/user.helper'
import { Request, Response } from 'express'
import { UserschemaValidate } from '../models/users/users.validate'
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


class authController {

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
                gender: userData.gender
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

    logoutUser = async (req: Request, res: Response) => {
        try {
            console.log('In logout');
            const authHeader = req.headers['authorization']?.split(' ')[1];
            console.log("🚀 ~ file: auth.controller.ts:61 ~ authController ~ logoutUser= ~ authHeader:", authHeader)

            jwt.sign(authHeader as string, process.env.ACCESS_TOKEN_SECRET || '', (err, logout) => {
                console.log("Error", err);//{ expiresIn: 1 }, 
                console.log("Logout", logout);
                if (logout) {
                    return res.status(200).json({
                        message: "Logout success",
                        success: true
                    });
                } else {
                    return res.status(500).json({
                        message: "Something went wrong! Please try again later.",
                        success: false,
                        err
                    });
                }
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong! Please try again later.",
                success: false,
                error
            });
        }
    }

    refreshToken = async (req: Request, res: Response) => {
        //@ts-ignore
        console.log(">>>>>>>>>>>>.", req.headers.cookie)
        //@ts-ignore
        let jwtData = req.headers.cookie?.split('wt=')[1]
        console.log("🚀 ~ file: auth.controller.ts:95 ~ authController ~ refreshToken= ~ jwtData:", jwtData)
        if (jwtData) {

            // Destructuring refreshToken from cookie
            const refreshToken = jwtData;
            console.log("🚀 ~ file: auth.controller.ts:100 ~ authController ~ refreshToken= ~ refreshToken:", refreshToken)

            // Verifying refresh token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || '',
                //@ts-ignore
                (err, decoded) => {
                    if (err) {
                        console.log("Error", err);
                        // Wrong Refesh Token
                        return res.status(406).json({ message: 'Unauthorized' });
                    }
                    else {
                        // Correct token we send a new access token
                        const accessToken = jwt.sign(req.body.user, process.env.ACCESS_TOKEN_SECRET || '', {
                            expiresIn: '10m'
                        });
                        return res.json({ accessToken });
                    }
                })
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    }

}

export const AuthController = new authController();