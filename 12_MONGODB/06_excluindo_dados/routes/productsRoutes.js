import express from 'express';
const router = express.Router();

import ProductController from '../controllers/ProductController.js';

/* GET */
router.get('/create', ProductController.createProduct);
router.get('/', ProductController.showProducts);
router.get('/:id', ProductController.getProduct);

/* POST */
router.post('/remove/:id', ProductController.removeProduct);
router.post('/create', ProductController.createProductPost);

export default router;
