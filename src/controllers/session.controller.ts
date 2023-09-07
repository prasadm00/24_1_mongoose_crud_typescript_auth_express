
import { NextFunction, Request, Response } from "express";
import {
    getGithubOathToken,
    getGithubUser,
    getGoogleOauthToken,
    getGoogleUser,
} from "../helper/session.helper";

import { requestGetAuthCodeUrl } from '../helper/utils'

import { UserschemaValidate } from '../models/users/users.validate'
import { userServices } from '../helper/user.helper'
// import getGoogleOAuthUrl from '../utils/getGoogleUrl'

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
    console.log("🚀 ~ file: getGoogleUrl.ts:16 ~ getGoogleOAuthUrl ~ options:", options)

    const qs = new URLSearchParams(options)
    console.log("QS===>>>", qs.toString());

    return `${rootUrl}?${qs.toString()}`
}
export const redirectTest = async (req: Request, res: Response) => {


    console.log("Requrl", requestGetAuthCodeUrl);

    try {
        const data = getGoogleOAuthUrl()
        console.log("🚀 ~ file: session.controller.ts:26 ~ redirectTest ~ data:", data)
        res.redirect(data)
        return data
    } catch (error) {
        console.log("Error", error);
    }
    /*
    try {
        console.log("Inside redirectTest");
        res.redirect(requestGetAuthCodeUrl);
        console.log("Success");
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
    */
}


export const googleOauthHandler = async (req: Request, res: Response) => {
    // const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as unknown as string;
    console.log("Inside googleOauthHandler");

    // 1 get the code from qs

    const code = req.query.code as string;
    console.log("🚀 ~ file: session.controller.ts:72 ~ googleOauthHandler ~ code:", code)
    const { id_token, access_token } = await getGoogleOauthToken({ code });
    console.log("🚀 ~ file: session.controller.ts:74 ~ googleOauthHandler ~ id_token, access_token:", id_token, access_token)

    // 2. get the id  and access  token with the code 

    // 3. get the user with tokens

    // 4. upsert the user 

    // 5. create a session

    // 6. create access and refresh token

    // 7. set cookies 

    // 8. redirect back to client




    /*
    try {
        const code = req.query.code as string;//auth_code
        console.log("🚀 ~ file: session.controller.ts:25 ~ googleOauthHandler ~ code:", code)
        const pathUrl = (req.query.state as string) || "/";

        if (!code) {
            return res.status(401).json({
                status: "fail",
                message: "Authorization code not provided!",
            });
        }
        console.log("Outside code");

        const { id_token, access_token } = await getGoogleOauthToken({ code });
        console.log("🚀 ~ file: session.controller.ts:37 ~ googleOauthHandler ~ id_token, access_token:", id_token, access_token)

        const { name, verified_email, email, picture } = await getGoogleUser({
            id_token,
            access_token,
        });

        if (!verified_email) {
            return res.status(403).json({
                status: "fail",
                message: "Google account not verified",
                success: false
            });
        }

        // get the user from db if present generate jwt token

        let userData = await userServices.getUserByEmail(email)
        console.log("🚀 ~ file: session.controller.ts:46 ~ googleOauthHandler ~ userData:", userData)

        //if not present create new user and generate jwt

        if (!userData) {

            //data to be saved in database
            const data = {
                firstName: name,
                lastName: '',
                email: email,
                password: '',
                age: '',
                gender: '',
                role: req.body.role ? req.body.role : 'user',
                provider: 'Google'
            }
            //validating the request
            const { error, value } = UserschemaValidate.validate(data)
            try {
                if (error) {
                    console.log("Error in validation", error);
                    return res.status(401).json({
                        message: "Error while creating new user validation", error,
                        success: false
                    });
                }
                userData = await userServices.createUser(value)
                console.log("🚀 ~ file: session.controller.ts:71 ~ googleOauthHandler ~ userData:", userData)
            } catch (error) {
                console.log("Error while creating new user", error);
            }
        }


        const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
        const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
        const token = jwt.sign(userData || '', TOKEN_SECRET, {
            expiresIn: `${TOKEN_EXPIRES_IN}m`,
        });

        res.cookie("token", token, {
            expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        }).status(200).json({
            success: true,
            token,
            userData
        });

        // res.redirect(`${FRONTEND_ORIGIN}${pathUrl}`);
    } catch (err: any) {
        console.log("Failed to authorize Google User", err);
        // return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
    }
*/
};



/*

export const githubOauthHandler = async (req: Request, res: Response) => {
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as unknown as string;

    try {
        const code = req.query.code as string;
        const pathUrl = (req.query.state as string) ?? "/";

        if (req.query.error) {
            return res.redirect(`${FRONTEND_ORIGIN}/login`);
        }

        if (!code) {
            return res.status(401).json({
                status: "error",
                message: "Authorization code not provided!",
            });
        }

        const { access_token } = await getGithubOathToken({ code });

        const { email, avatar_url, login } = await getGithubUser({ access_token });

        const user = await prisma.user.upsert({
            where: { email },
            create: {
                createdAt: new Date(),
                name: login,
                email,
                photo: avatar_url,
                password: "",
                verified: true,
                provider: "GitHub",
            },
            update: { name: login, email, photo: avatar_url, provider: "GitHub" },
        });

        if (!user) return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);

        const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN as unknown as number;
        const TOKEN_SECRET = process.env.JWT_SECRET as unknown as string;
        const token = jwt.sign({ sub: user.id }, TOKEN_SECRET, {
            expiresIn: `${TOKEN_EXPIRES_IN}m`,
        });

        res.cookie("token", token, {
            expires: new Date(Date.now() + TOKEN_EXPIRES_IN * 60 * 1000),
        });

        res.redirect(`${FRONTEND_ORIGIN}${pathUrl}`);
    } catch (err: any) {
        return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
    }
};
*/