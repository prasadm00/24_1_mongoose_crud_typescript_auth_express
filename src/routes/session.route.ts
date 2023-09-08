import express from 'express';
import {
    redirectTest,
    googleOauthHandler,
} from '../controllers/session.controller';

const router = express.Router();

router.get('/auth', redirectTest)

router.get('/oauth/google', googleOauthHandler);

export default router;
