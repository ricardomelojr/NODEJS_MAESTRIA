import express from 'express';
import products from '../data/products.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { products });
});

router.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.render('product', { product });
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;
