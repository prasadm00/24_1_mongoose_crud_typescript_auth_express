// import qs from 'qs'

function getGoogleOAuthUrl() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_url: process.env.GOOGLE_OAUTH_REDIRECT_FULL as string,
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

export default getGoogleOAuthUrl;