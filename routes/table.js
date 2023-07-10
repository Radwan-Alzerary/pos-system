const router = require('express').Router();
const Category = require("../models/category");
const Food = require("../models/food");
const Table = require("../models/table");
const Invoice = require("../models/invoice");


router.post('/addtable', async (req, res) => {
    const table = new Table({
        number: req.body.tablenum,
    });
    try {
        const newtable = await table.save();
        res.status(201).redirect('/setting');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})




module.exports = router;
