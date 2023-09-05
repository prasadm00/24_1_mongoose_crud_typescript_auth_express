
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    console.log("🚀 ~ file: auth.middleware.ts:7 ~ authenticateToken ~ authHeader:", authHeader)
    const token = authHeader && authHeader.split(' ')[1] || '';
    console.log("🚀 ~ file: auth.middleware.ts:9 ~ authenticateToken ~ token:", token)

    if (token === null) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log("Error", err);
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        (req as any).user = user;
        next();
    });
};
