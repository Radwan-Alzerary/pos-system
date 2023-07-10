const router = require('express').Router();
router.use('/admin', require('./users'));
router.use('/', require('./routes'));
router.use('/food', require('./food'));
router.use('/cashier', require('./cashier'));
router.use('/table', require('./table'));
router.use('/invoice', require('./invoice'));
router.use('/setting', require('./setting'));
  
module.exports = router;
