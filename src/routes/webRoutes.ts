import express from 'express';

const webRouter = express.Router();


webRouter.get('/', async (req, res) => {
    res.render('index');
});

webRouter.get('/home', async (req, res) => {
    try {
        const mangaList = await fetch('http://localhost:8080/api/v1/manga/latest?source=Trend');
        const data = await mangaList.json();
        res.render('home', { data: data.data });
    } catch (error) {
        console.error(error);
        res.render('error');
    }
});


export default webRouter;