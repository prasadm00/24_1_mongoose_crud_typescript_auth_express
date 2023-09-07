import express from 'express';
import {
    // githubOauthHandler,
    redirectTest,
    googleOauthHandler,
} from '../controllers/session.controller';

const router = express.Router();


// first req
router.get('/auth', redirectTest)

// after redirect
router.get('/oauth/google', googleOauthHandler);


export default router;
