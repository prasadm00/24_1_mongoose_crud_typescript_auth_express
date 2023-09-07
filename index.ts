import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from "./src/services/database.service"
import { userRouter } from './src/routes/users.routes'
import { authRouter } from './src/routes/auth.routes'
import sessionRouter from './src/routes/session.route';
import { requestGetAuthCodeUrl } from './utils'
import { getAccessToken, getProfileData } from './helper'

const app: Express = express();
const port = process.env.PORT;

connectToDatabase().then((result) => {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.log("Error", err);
});

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//routes
app.use('/', authRouter)
app.use('/user', userRouter)
app.use("/api/sessions", sessionRouter);

app.get('/auth', async (req, res) => {
    try {
        console.log("url", requestGetAuthCodeUrl);
        res.redirect(requestGetAuthCodeUrl);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
});



app.get(process.env.REDIRECT_URI || '', async (req, res) => {
    const authorization_token = req.query;
    try {
        // get access token using authorization token
        //@ts-ignore
        const response = await getAccessToken(authorization_token.code);
        // get access token from payload/
        //@ts-ignore

        const { access_token } = response.data || '';
        // get user profile data
        const user = await getProfileData(access_token);
        //@ts-ignore
        const user_data = user.data;
        res.send(`
        <h1> welcome ${user_data.name}</h1>
        <img src="${user_data.picture}" alt="user_image" />
      `);
        console.log("Success", user_data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        console.log("Error");
    }
});



app.get('/', (req: Request, res: Response) => {
    console.log("Hello");
    res.send('Express + TypeScript Server');
});

