const router = require('express').Router();
const Setting = require("../models/pagesetting");
router.get('/', async (req, res) => {
  const setting = await Setting.find();

  if (setting.length < 1) {
    const newSetting = new Setting({});
    await newSetting.save();
  } 
  res.render('dashboard');
})


module.exports = router;
