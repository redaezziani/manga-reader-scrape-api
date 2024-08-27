import express from 'express';
import  {getLatestMangaList,searchManga}  from '../controllers/mangaController';

const router = express.Router();


router.get('/latest', getLatestMangaList);
router.get('/search', searchManga);

export default router;