import express from 'express';

const webRouter = express.Router();


webRouter.get('/', async (req, res) => {
    res.render('index');
});
webRouter.get('/read-manga', async (req, res) => {
    const { title, chapter, pages } = req.query;
  
    try {
      const pagesArray = (pages as string).split(',');
  
      res.render('read-manga', { title, chapter, pages: pagesArray });
    } catch (error) {
      console.error('Error rendering images:', error);
      res.status(500).json({
        status: 'error',
        statusText: 'Internal server error',
      });
    }
});

export default webRouter;