import express from 'express';
import  {getLatestMangaList,searchManga,getMangaDetails,getMangaChapterPages}  from '../controllers/mangaController';

const mangaRouter = express.Router();


mangaRouter.get('/latest', getLatestMangaList);
mangaRouter.get('/search', searchManga);
mangaRouter.get('/details', getMangaDetails);
mangaRouter.get('/chapter', getMangaChapterPages);

export default mangaRouter;