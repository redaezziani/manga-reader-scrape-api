import express from 'express';
import  {getLatestMangaList,searchManga,getMangaDetails}  from '../controllers/mangaController';

const router = express.Router();


router.get('/latest', getLatestMangaList);
router.get('/search', searchManga);
router.get('/details', getMangaDetails);

export default router;