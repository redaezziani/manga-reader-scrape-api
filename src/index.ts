import 'tsconfig-paths/register';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { secrets } from './config/constants';
import authenticateToken from './middleware/auth';
const app = express();

// this for routes
import router from './routes/mangaRoutes';

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(authenticateToken);

app.use('/api/v1/manga', router);

app.get('/api/v1', (req, res) => {
  res.send('welcome to manga api');
});

app.listen(secrets.PORT, () => {
console.log(`Server is running on ${secrets.PORT} 🦄`);
});

