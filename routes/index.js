const router = require('express').Router();
router.use('/admin', require('./users'));
router.use('/', require('./routes'));
  
module.exports = router;
