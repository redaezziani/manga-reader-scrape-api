// import dotenv from 'dotenv';

// dotenv.config();

// describe('GET /api/v1/manga/search', () => {
//     it('should return an array when a valid title is provided', async () => {
//         const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/search?title=one piece`,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//             },
//         });
        
//         const data = await response.json();
        
//         expect(response.status).toBe(200);
//         expect(data.data).toBeDefined();
//         expect(Array.isArray(data.data)).toBe(true);
//     });
//     it('should return 404 when a title is not provided', async () => {
//         const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/search`,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//             },
//         });
        
//         const data = await response.json();
        
//         expect(response.status).toBe(404);
//         expect(data.statusText).toBe('title query parameter is required');
//     });
//     // for the case when the title is not found
//     it('should return 404 when a title is not found', async () => {
//         const response = await fetch(`http://localhost:${process.env.PORT}/api/v1/manga/search?title=notfound`,
//         {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
//             },
//         });
        
//         const data = await response.json();
        
//         expect(response.status).toBe(404);
//         expect(data.statusText).toBe('No manga found');
//     });  
// });
