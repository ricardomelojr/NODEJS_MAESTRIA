const express = require('express');

const router = express.Router();

const path = require('path');

router.get('/', (req, res, next) => {
  res.sendFile(
    path.join(__dirname, '../', 'views', 'produtos', 'produtos.html')
  );
});

router.get('/add_produto', (req, res, next) => {
  res.sendFile(
    path.join(__dirname, '../', 'views', 'produtos', 'add_produto.html')
  );
});

module.exports = router;
