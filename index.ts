import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from "./src/services/database.service"
import { userRouter } from './src/routes/users.routes'
import { authRouter } from './src/routes/auth.routes'
import sessionRouter from './src/routes/session.route';

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


app.get('/', (req: Request, res: Response) => {
    console.log("Hello");
    res.send('Express + TypeScript Server');
});

