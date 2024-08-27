import dotenv from 'dotenv';

dotenv.config();

describe('GET /api/v1/manga/download', () => {
    it('should return manga chapter pages when valid title and chapter are provided', async () => {
        const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/download?title=jujutsu-kaisen&chapter=266`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });
        
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.data).toBeDefined();
    });
});
