const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('ca orders');
});

module.exports = router;