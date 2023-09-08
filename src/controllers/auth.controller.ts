import { userServices } from '../helper/user.helper'
import { Request, Response } from 'express'
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

        //@ts-ignore
        if (!userData) {
            return res.status(401).json({
                message: "User doesnot exist.",
                success: false
            });
        }

        if (userData.provider === "Google" || userData.provider === "GitHub") {
            return res.status(401).json({
                message: `Use ${userData.provider} OAuth2 instead`,
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
                role: userData.role,
                provider: userData.provider
            };

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '180s' });
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || '');

            res.cookie("token", accessToken, {
                expires: new Date(Date.now() + 1 * 60 * 1000),
            })
            return res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user,
                message: 'LoggedIn and created accessToken,refreshToken successfully!'
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

            jwt.sign(authHeader as string, process.env.ACCESS_TOKEN_SECRET || '', (err, logout) => {
                if (logout) {
                    return res.status(200).json({
                        message: "Logout success",
                        success: true
                    }).cookie("token", "", { maxAge: -1 });
                } else {
                    return res.status(500).json({
                        message: "Something went wrong! Please try again later.",
                        success: false,
                        Error: err
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
        let jwtData = req.headers.cookie?.split('wt=')[1]
        if (jwtData) {
            const refreshToken = jwtData;

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
                        return res.status(200).json({ accessToken, message: 'Generated refresh token successfully!' });
                    }
                })
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    }

}

export const AuthController = new authController();