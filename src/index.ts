import 'tsconfig-paths/register';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { secrets } from './config/constants';
import authenticateToken from './middleware/auth';
const app = express();

// this for routes
import mangaRouter from './routes/mangaRoutes';
import webRouter from './routes/webRoutes';
import path from 'path';

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.json());
// app.use(authenticateToken);

app.use('/api/v1/manga', mangaRouter);
app.use('/web', webRouter);

app.get('/api/v1', (req, res) => {
  res.send('welcome to manga api');
});


app.listen(secrets.PORT, () => {
console.log(`Server is running on ${secrets.PORT} 🦄`);
});

