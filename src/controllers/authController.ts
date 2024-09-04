import express from 'express';
import z from 'zod';
import db from '@/utils/db';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth';
import redisClient from "@/utils/redis";
// Define schema for user registration
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(255),
    name: z.string().min(3).max(225),
});

// User registration handler
const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, name } = registerSchema.parse(req.body);
        const hashedPassword = await hashPassword(password);

        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email is already in use',
                status: 'error',
                data: null,
            });
        }

        // Create a new user
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        res.status(201).json({
            message: 'User created successfully',
            status: 'success',
            data: { userId: newUser.id },
        });
    } catch (err: any) {
        res.status(500).json({
            message: err.message || 'Internal server error',
            status: 'error',
            data: null,
        });
    }
}

// User login handler
const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
                status: 'error',
                data: null,
            });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid password',
                status: 'error',
                data: null,
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, username: user.email, role: 'user' });
        const refreshToken = generateRefreshToken({ id: user.id, username: user.email, role: 'user' });

        // Check if a session already exists for this user
        const existingSession = await db.session.findFirst({ where: { userId: user.id } });

        if (existingSession) {
            // Update existing session with new tokens
            await db.session.update({
                where: { id: existingSession.id },
                data: {
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                },
            });
        } else {
            // Create a new session
            await db.session.create({
                data: {
                    userId: user.id,
                    refreshToken,
                    accessToken,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                },
            });
        }

        (req.session as any).userId = user.id;
        (req.session as any).accessToken = accessToken;
        (req.session as any).refreshToken = refreshToken

        res.status(200).json({
            message: 'Login successful',
            status: 'success',
            data: { accessToken, refreshToken },
        });
    } catch (err: any) {

        res.status(500).json({
            message: err.message || 'Internal server error',
            status: 'error',
            data: null,
        });
    }
}


const profile = async (req: express.Request, res: express.Response) => {
    if (!(req.session as any).userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            status: 'error',
            data: null,
        });
    }

    // lets use redis to cache the user profile
    const cacheKey = `profile:${(req.session as any).userId}`;

    try {
        const cacheData = await redisClient.get(cacheKey);
        if (cacheData) {
            return res.status(200).json({
                message: 'Profile fetched successfully',
                status: 'success',
                data: JSON.parse(cacheData),
            });
        }
    } catch (error) {
        console.error('Error fetching data from Redis:', error);
    }

    // Fetch user profile using req.session.userId
    res.status(200).json({
        message: 'Profile fetched successfully',
        status: 'success',
        data: {
            userId: (req.session as any).userId,
            accessToken: (req.session as any).accessToken,
            refreshToken: (req.session as any).refreshToken,
        },
    });
}

    

export { register, login , profile };
