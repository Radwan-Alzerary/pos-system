const router = require('express').Router();
const Setting = require("../models/pagesetting");
const Invoice = require("../models/invoice");
const Food = require("../models/food");

router.get('/', async (req, res) => {
  const setting = await Setting.find();


  if (setting.length < 1) {
    const newSetting = new Setting({});
    // await newSetting.save();
  }

  res.render('dashboard');
})

router.get('/updateinvoicecost', async (req, res) => {
  try {
    const invoices = await Invoice.find({ foodcost: { $exists: false } }).populate('food.id');

    for (const invoice of invoices) {
      let totalFoodCost = 0;
      for (const foodItem of invoice.food) {
        if (foodItem.id && foodItem.id.cost && foodItem.quantity) {
          totalFoodCost += foodItem.id.cost * foodItem.quantity;
        }
      }

      invoice.foodcost = totalFoodCost;
      await invoice.save();
    }

    res.json({ message: 'Food costs added to invoices successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding food costs to invoices.' });
  }


})

module.exports = router;
