import dotenv from 'dotenv';

dotenv.config();

describe('GET /api/v1/manga/details', () => {
    it('should return manga details when a valid title is provided', async () => {
        const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/details?title=naruto-digital-colored`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });
        
        const data = await response.json();

        console.log(data.statusText);
        
        expect(response.status).toBe(200);
        expect(data.data).toBeDefined();
        expect(data.data.title).toBeDefined();
        expect(data.data.image).toBeDefined();
        expect(data.data.averagerate).toBeDefined();
        expect(data.data.author).toBeDefined();
        expect(data.data.artist).toBeDefined();
        // need to be a array of strings
        expect(data.data.genres).toBeDefined();
        expect(data.data.postYear).toBeDefined();
        expect(data.data.status).toBeDefined();
        expect(data.data.latestChapter).toBeDefined();
    });
});
