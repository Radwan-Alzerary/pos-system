const router = require('express').Router();
const Category = require("../models/category");
const Food = require("../models/food");
const Table = require("../models/table");
const Invoice = require("../models/invoice");
// Route: Add food to an invoice and handle invoice creation if needed
const Setting = require("../models/pagesetting");
const nodeHtmlToImage = require('node-html-to-image')
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const puppeteer = require('puppeteer');
const browserPromise = puppeteer.launch(); // Launch the browser once
async function printImageAsync(imagePath) {
  const setting = await Setting.findOne()

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${setting.printerip}:9100`,
    characterSet: CharacterSet.SLOVENIA,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
    options: {
      timeout: 2000
    }
  });

  try {
    printer.alignCenter()
    await printer.printImage(`./public${setting.shoplogo}`);  // Print PNG image
    await printer.printImage(imagePath);  // Print PNG image
    await printer.cut();
    await printer.execute();
    await printer.execute();
    console.log('Image printed successfully.');
  } catch (error) {
    console.error('Error printing image:', error);
  }
}

router.get('/list', async (req, res) => {
  try {

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const day = 12; // Specify the desired day

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    startOfDay.setDate(day);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(day + 1);

    const invoicesForDay = await Invoice.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: -1 });

    let dateview = req.query.dateview || 1;

    let pagenum = req.query.page || 1;
    let state = req.query.state || '';
    let query = {};

    if (state) {
      query.type = state;
    }


    let invoice = ""
    if (dateview == "last30day") {
      invoice = await Invoice.find({ createdAt: { $gte: thirtyDaysAgo } }, query).sort({ createdAt: -1 }).skip((pagenum - 1) * 10).limit(10);
    } else if (dateview == "lastday") {
      invoice = await Invoice.find({ "$and": [query,{createdAt : { $gte: lastDay }}]}).sort({ createdAt: -1 }).skip((pagenum - 1) * 10).limit(10);
    } else if (dateview == "lastmonth") {
      invoice = await Invoice.find({"$and": [query,{createdAt : { $gte: lastYear }}] })
      .select('-__v') // Exclude the '__v' field if it exists
      .sort({ createdAt: -1 })
      .skip((pagenum - 1) * 10)
      .limit(10);
        } else if (dateview == "lastyear") {
      invoice = await Invoice.find({ createdAt: { $gte: lastYear }, query }).sort({ createdAt: -1 }).skip((pagenum - 1) * 10).limit(10);
    } else {
      invoice = await Invoice.find(query).sort({ createdAt: -1 }).skip((pagenum - 1) * 10).limit(10);
    }
    console.log(invoice)

    const invoiceCount = await Invoice.countDocuments();
    res.render('invoice-list', { invoice, invoiceCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})

router.post('/food', async (req, res) => {
  try {
    let existingFoodcheck = 0;
    const tableId = req.body.tableId;
    const { foodId, quantity, discount, discountType } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    const lastInvoice = await Invoice.findOne().sort({ number: -1 });

    let invoiceNumber;
    if (lastInvoice) {
      // If a previous invoice exists, increment the last invoice number by 1
      invoiceNumber = lastInvoice.number + 1;
    } else {
      // If no previous invoice exists, start with a default value of 1
      invoiceNumber = 1;
    }


    let invoice = null;
    if (table.invoice.length === 0) {
      // If the table does not have an invoice, create a new one
      invoice = new Invoice({
        number: invoiceNumber,
        type: 'قيد المعالجة', // Replace with the appropriate type
        active: true,
      });
      await invoice.save();
      table.invoice.push(invoice._id);
      await table.save();
    } else {
      // If the table already has an invoice, use the existing one
      invoice = await Invoice.findById(table.invoice[0]);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
    }
    let updatedfoodid = ""

    // Check if the food item already exists in the invoice
    const existingFood = invoice.food.find((item) => item.id.toString() === foodId);
    if (existingFood) {
      const foodData = await Food.findById(existingFood.id);
      updatedfoodid = foodData.id
      existingFoodcheck = 1
      // If the food item already exists, increment the quantity by 1
      existingFood.quantity += 1;
    } else {
      // If the food item doesn't exist, add it to the invoice
      const food = await Food.findById(foodId);
      if (!food) {
        return res.status(404).json({ error: 'Food not found' });
      }
      const newFood = {
        id: food._id,
        quantity: 1,
        discount: 0,
        discountType: discountType || 'cash',
      };

      invoice.food.push(newFood);
    }

    await invoice.save();

    // Get the last added food from the invoice
    const lastAddedFood = invoice.food[invoice.food.length - 1].id;

    // Populate the last added food
    const populatedFood = await Food.findById(lastAddedFood);

    if (existingFoodcheck) {
      res.json({
        message: 'alredyadd',
        food: populatedFood,
        newquantity: existingFood.quantity,
        invoiceId: invoice.id,
        updatedfoodid: updatedfoodid
      });
    } else {
      res.json({
        message: 'Food added to the invoice successfully',
        food: populatedFood,
        invoiceId: invoice.id,
        newquantity: 1
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/changequantity', async (req, res) => {
  try {
    const tableId = req.body.tableId;
    const foodId = req.body.foodId;
    const quantity = req.body.quantity
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    let invoice = await Invoice.findById(table.invoice[0]);

    const foodItem = invoice.food.find((item) => item.id.toString() === foodId);

    if (!foodItem) {
      return res.status(404).json({ error: 'Food item not found in the invoice.' });
    }
    // console.log(foodItem)
    foodItem.quantity = quantity;

    // Save the updated invoice
    await invoice.save();
    res.json({
      message: 'quantity changed',
      foodItem
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/changedescount', async (req, res) => {
  try {
    const discount = req.body.discount
    const invoiceid = req.body.invoiceId

    let invoice = await Invoice.findById(invoiceid);

    invoice.discount = discount;

    // Save the updated invoice
    await invoice.save();
    res.json({
      message: 'discount changed',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/price', async (req, res) => {
  try {
    const invoiceId = req.body.invoiceId;
    const invoice = await Invoice.findById(invoiceId).populate({
      path: 'food.id',
      model: 'Food'
    })
      ;
    let total = 0;
    let totaldiscount = 0
    for (const food of invoice.food) {
      // console.log(food)
      const quantity = food.quantity;
      const discount = food.discount;
      const price = food.id.price;
      total += price * quantity;
      totaldiscount += discount * quantity;
    }
    if (invoice.discount >= 0) {
      totaldiscount += invoice.discount

    }
    finalprice = total - totaldiscount;
    if (finalprice < 0) {
      finalprice = 0;
    }
    res.json({ total, totaldiscount, finalprice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/previesinvoice', async (req, res) => {
  try {
    const table = await Table.findById(req.body.tableId)
    console.log(table)
    if (table.invoice.length > 0) {
      return res.json({ Massage: "table have invoice", reloded: false })
    } else {
      table.invoice.push(table.lastinvoice)
      table.save()

      res.json({ Massage: "loaded old invoice", reloded: true, lastinvoiceid: table.lastinvoice })

    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cancele', async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.body.invoiceId);
    // console.log(req.body);
    invoice.active = false;
    invoice.type = "ملغى";
    invoice.fullcost = req.body.totalcost;
    invoice.fulldiscont = req.body.totaldicont;
    invoice.finalcost = req.body.finalcost;
    invoice.tableid = req.body.tableId;
    invoice.progressdata = Date.now();

    const currentable = await Table.findById(invoice.tableid)

    currentable.lastinvoice = req.body.invoiceId

    await currentable.save();


    await invoice.save();
    // console.log(req.body.tableId)
    const updatedInvoice = await Table.findByIdAndUpdate(
      req.body.tableId,
      { $pull: { invoice: req.body.invoiceId } },
      { new: true }
    );
    // console.log(updatedInvoice)

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice or food item not found' });
    }

    res.json({
      message: 'canciled to the invoice successfully',
    })
  } catch (err) {
    console.error(err);
    return res.json({ message: 'No invoice found in the table', err });
  }
})

router.post('/finish', async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.body.invoiceId);
    // console.log(req.body);

    invoice.active = false;
    invoice.type = "مكتمل";
    invoice.progressdata = Date.now();
    invoice.fullcost = req.body.totalcost;
    invoice.fulldiscont = req.body.totaldicont;
    invoice.finalcost = req.body.finalcost;
    invoice.tableid = req.body.tableId;


    const currentable = await Table.findById(invoice.tableid)

    currentable.lastinvoice = req.body.invoiceId

    await invoice.save();
    await currentable.save();
    const updatedInvoice = await Table.findByIdAndUpdate(
      req.body.tableId,
      { $pull: { invoice: req.body.invoiceId } },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice or food item not found' });
    }

    res.json({
      message: 'finished to the invoice successfully',
    })
  } catch (err) {
    console.error(err);
    return res.json({ message: 'No invoice found in the table', err });
  }
})

router.post('/printinvoice', async (req, res) => {
  try {
    const htmlContent = req.body.htmbody;

    const generateImage = async () => {
      const browser = await browserPromise; // Reuse the same browser instance
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      await page.waitForSelector('main'); // Wait for the <main> element to be rendered
      const mainElement = await page.$('main'); // Select the <main> element

      await mainElement.screenshot({
        path: './image.png',
        fullPage: false, // Capture only the <main> element
        javascriptEnabled: false,
        headless: true
      });
      console.log("Image generation done");
    };

    await generateImage(); // Generate the image asynchronously
    await printImageAsync("./image.png")
    res.status(200).json({ msg: "done" });
  } catch (err) {
    console.error(err);
    return res.json({ message: 'No invoice found in the table', err });
  }
});

router.get('/:tableId/foodmenu', async (req, res) => {
  try {
    const { tableId } = req.params;
    const setting = await Setting.findOne().sort({ number: -1 });
    const table = await Table.findById(tableId).populate({
      path: 'invoice',
      populate: {
        path: 'food.id',
        model: 'Food'
      }
    });

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    if (table.invoice.length === 0) {
      return res.json({ message: 'No invoice found in the table', food: [] });
    }

    const invoice = table.invoice[0];

    res.json({ message: 'Food items retrieved successfully', newquantity: invoice.food.quantity, food: invoice.food, invoiceid: invoice.id, setting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:invoiceId/checout', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const setting = await Setting.findOne().sort({ number: -1 });
    const invoice = await Invoice.findById(invoiceId).populate({
      path: 'food.id',
      model: 'Food'
    });

    res.json({ message: 'Food items retrieved successfully',invoicedate: invoice.progressdata, food: invoice.food, invoiceid: invoice.id, setting: setting, finalcost: invoice.finalcost, fullcost: invoice.fullcost,invoicenumber : invoice.number, fulldiscont: invoice.fulldiscont });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:tableId/:invoiceId/food/:foodId', async (req, res) => {
  try {
    const { invoiceId, foodId, tableId } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { $pull: { food: { id: foodId } } },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice or food item not found' });
    }
    const checkempty = await Invoice.findById(invoiceId)
    if (checkempty.food.length < 1) {
      const updatetable = await Table.findByIdAndUpdate(
        tableId,
        { $pull: { invoice: invoiceId } },
        { new: true }
      );
    }
    return res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.patch('/:invoiceId/editquantity/:foodId', async (req, res) => {
  try {
    const { invoiceId, foodId } = req.params;
    const quantity = req.body;

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, 'food.id': foodId },
      {
        $set: {
          'food.$.quantity': quantity,
        },
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice or food item not found' });
    }

    return res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.patch('/:invoiceId/editdiscount/:foodId', async (req, res) => {
  try {
    const { invoiceId, foodId } = req.params;
    const quantity = req.body;

    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, 'food.id': foodId },
      {
        $set: {
          'food.$.quantity': quantity,
        },
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice or food item not found' });
    }

    return res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  res.render('setting');
})

// Rest of the routes...
module.exports = router;
