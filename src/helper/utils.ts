import * as querystring from 'querystring';

const googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

const queryParams = {
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: `http://localhost:8000${process.env.REDIRECT_URI}`,
};

// This object contains information that will be passed as query params to the auth token endpoint
const authTokenParams = {
    ...queryParams,
    response_type: 'code',
};

// The scopes (portion of user's data) we want to access
const scopes = ['profile', 'email', 'openid'];

// A URL formed with the auth token endpoint and the query parameters
const requestGetAuthCodeUrl = `${googleAuthEndpoint}?${querystring.stringify(authTokenParams)}&scope=${scopes.join(' ')}`;
//https://accounts.google.com/o/oauth2/v2/auth?client_id=232211929464-3u573c1k63l0prlvke84m84uq3fjokkf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fsecrets&response_type=code&scope=profile
export {
    requestGetAuthCodeUrl,
    googleAuthEndpoint,
    queryParams,
    authTokenParams,
};