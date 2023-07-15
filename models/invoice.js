const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    type: { type: String },
    active: { type: Boolean },
    fullcost: { type: Number },
    fulldiscont: { type: Number },
    finalcost: { type: Number },
    deleveryadress: { type: String },
    tableid: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    food: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: { type: Number },
        discount: { type: Number },
        discountType: { type: String }
    }],
    discount: { type: Number },
    progressdata: { type: Date }

}, {
    timestamps: true
});
const invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = invoice;
