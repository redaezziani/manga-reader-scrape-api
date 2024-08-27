// Desc: test for the getLatestMangaList.test.ts file
import dotenv from 'dotenv';

dotenv.config();

describe('GET /api/v1/manga/latest', () => {
    it('should return a arry', async () => {
        // lets send this :ACCESS_TOKEN to the server and see if it will return a response
      const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/latest`,
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });
      const parsData = await response.json();
      expect(parsData.data).toBeDefined();
      expect(Array.isArray(parsData.data)).toBe(true);
    });

    it('should return an array of objects', async () => {
      const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/latest`,
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });
      const parsData = await response.json();
      expect(parsData.data).toBeDefined();
      expect(Array.isArray(parsData.data)).toBe(true);
      expect(typeof parsData.data[0]).toBe('object');
    });
});