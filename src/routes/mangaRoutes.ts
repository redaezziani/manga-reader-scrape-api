import express from 'express';
import  {getLatestMangaList,searchManga,getMangaDetails,getMangaChapterPages}  from '../controllers/mangaController';

const router = express.Router();


router.get('/latest', getLatestMangaList);
router.get('/search', searchManga);
router.get('/details', getMangaDetails);
router.get('/chapter', getMangaChapterPages);

export default router;