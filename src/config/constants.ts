import dotenv from 'dotenv';

dotenv.config();


export const secrets = {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || '',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || '',
};

