import { secrets } from '@/config/constants';
import { Request, Response, NextFunction } from 'express';

const VALID_ACCESS_TOKEN = secrets.ACCESS_TOKEN;

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token === VALID_ACCESS_TOKEN) {
        next(); 
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid access token' }); 
    }
};

export default authenticateToken;
