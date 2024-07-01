import express from 'express';
const router = express.Router();

import ProductController from '../controllers/ProductController.js';

router.post('/create', ProductController.createProductPost);
router.get('/create', ProductController.createProduct);
router.get('/', ProductController.showProducts);
router.get('/:id', ProductController.getProduct);

export default router;
