const express = require('express');

const router = express.Router();

const path = require('path');

router.get('/usuarios', (req, res, next) => {
  res.sendFile(
    path.join(__dirname, '../', 'views', 'usuarios', 'usuarios.html')
  );
});

module.exports = router;
