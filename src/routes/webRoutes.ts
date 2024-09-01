import express from 'express';

const webRouter = express.Router();


webRouter.get('/', async (req, res) => {
    res.render('index');
});


export default webRouter;