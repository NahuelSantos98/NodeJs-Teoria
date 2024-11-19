import { Router } from 'express';

const viewsRouter = Router();

viewsRouter.get('/', (req, res) => {
    res.render('index', {}); // De este modo solo renderizamos la vista, no pasamos objeto.
});

export default viewsRouter;
