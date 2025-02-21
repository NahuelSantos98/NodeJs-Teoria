import { Router } from 'express';

import productRouter from './producto.routes.js';
import cartRouter from './cart.routes.js';
import viewsRouter from './views.routes.js';
import userRouter from './user.routes.js';

const router = Router()

router.use('/products', productRouter);
router.use('/carts', cartRouter);
router.use('/views',viewsRouter);
router.use('/session', userRouter)

export default router