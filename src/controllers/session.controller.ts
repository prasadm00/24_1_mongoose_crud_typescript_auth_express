
import { Request, Response } from "express";
import {
    getGoogleOauthToken,
    getGoogleUser,
} from "../helper/session.helper";
import { UserschemaValidate } from '../models/users/users.validate'
import { userServices } from '../helper/user.helper'
import jwt from "jsonwebtoken";


function getGoogleOAuthUrl() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_FULL as string,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
    }

    const qs = new URLSearchParams(options)

    return `${rootUrl}?${qs.toString()}`
}
export const redirectTest = async (req: Request, res: Response) => {
    try {
        const data = getGoogleOAuthUrl()
        res.redirect(data)
        return data
    } catch (error) {
        console.log("Error", error);
    }
}


export const googleOauthHandler = async (req: Request, res: Response) => {
    console.log("Inside googleOauthHandler");

    try {
        // 1 get the code from qs
        const code = req.query.code as string;

        // 2. get the id  and access  token with the code 
        const { id_token, access_token } = await getGoogleOauthToken({ code });

        // 3. get the user with tokens
        //      1. decoding jwt by decoder
        const googleUser = jwt.decode(id_token)

        //      2. get google user by call
        const googleUserByToken = await getGoogleUser({ id_token, access_token })

        if (!googleUserByToken.verified_email) {
            return res.status(403).send('Google account is not verified')
        }
        // 4. upsert the user 
        let userData = await userServices.getUserByEmail(googleUserByToken.email)

        //if not present create new user and generate jwt
        if (!userData) {

            //data to be saved in database
            const data = {
                firstName: googleUserByToken.name,
                lastName: '-',
                email: googleUserByToken.email,
                password: '-',
                age: 0,
                gender: '-',
                role: req.body.role ? req.body.role : 'user',
                provider: 'Google',
                googleId: googleUserByToken.id
            }
            //validating the request
            const { error, value } = UserschemaValidate.validate(data)

            try {
                console.log("Inside create");
                if (error) {
                    console.log("Error in validation", error);
                    return res.status(401).json({
                        message: "Error while creating new user validation", error,
                        success: false
                    });
                }
                userData = await userServices.createUser(value)

            } catch (error) {
                console.log("Error while creating new user", error);
            }
        }
        // 5. create a session
        // 6. create access and refresh token
        let accessToken, refreshToken;
        try {
            const user = {
                id: userData?._id,
                firstName: userData?.firstName,
                lastName: userData?.lastName,
                email: userData?.email,
                age: userData?.age,
                gender: userData?.gender,
                role: userData?.role,
                provider: userData?.provider
            };

            accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '900s' });

            res.cookie("accessToken", accessToken, {
                maxAge: 900000,
                httpOnly: true,
                domain: 'localhost',
                path: "/",
                sameSite: "strict",
                secure: false
            })

            refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || '', { expiresIn: '10d' });
        } catch (error) {
            console.log("Error while creating Token", error);
        }
        // 7. set cookies 
        res.cookie("refreshToken", refreshToken, {
            maxAge: 8.64e+8,
            httpOnly: true,
            domain: 'localhost',
            path: "/",
            sameSite: "strict",
            secure: false
        })
        // 8. redirect back to client
        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            userData
        });

    } catch (error) {
        console.log("Error", error);
    }
};
