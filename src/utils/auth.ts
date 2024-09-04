import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const generateAccessToken = (user: { id: string; username: string; role: string }) => {

    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '15m' });
}

const generateRefreshToken = (user: { id: string; username: string; role: string }) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET ?? '', { expiresIn: '7d' });
}

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? '', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user as { id: string; username: string; role: string };
        next();
    });
}


const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    catch (err: any) {
        throw new Error(err);
    }
}

const comparePassword = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    }
    catch (err: any) {
        throw new Error(err);
    }
}

export { generateAccessToken, generateRefreshToken, authenticateToken , hashPassword, comparePassword };
