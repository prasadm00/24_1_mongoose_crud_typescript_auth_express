import axios from 'axios';
import * as querystring from 'querystring';
import { queryParams } from './utils';

const googleAccessTokenEndpoint = 'https://oauth2.googleapis.com/token';

const getAccessToken = async (authCode: string) => {
    const accessTokenParams = {
        ...queryParams,
        client_secret: process.env.CLIENT_APP_SECRET,
        code: authCode,
        grant_type: 'authorization_code',
    };

    try {
        return await axios({
            method: 'post',
            url: `${googleAccessTokenEndpoint}?${querystring.stringify(accessTokenParams)}`,
        });
    } catch (error) {
        console.log("Error==>>", error);
    }
};

const getProfileData = async (accessToken: string) => {
    try {
        return await axios({
            method: 'post',
            url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${accessToken}`,
        });
    } catch (error) {
        console.log("Error==>>", error);
    }
};

export {
    getAccessToken,
    getProfileData,
};
