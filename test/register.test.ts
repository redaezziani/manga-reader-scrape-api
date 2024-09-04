const app = 'http://localhost:8080/auth/login';
describe('POST /register', () => {
    it('should register a new user successfully', async () => {
        const response = await fetch(app, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' }),
        });

        const data = await response.json();
        expect(response.status).toBe(200); // 201
        expect(data.message).toBe('Login successful');
        expect(data.data).toBeDefined();
      
    });
});
