const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    type: { type: String },
    active: { type: Boolean },
    foodcost: {type: Number},
    fullcost: { type: Number },
    fulldiscont: { type: Number },
    finalcost: { type: Number },
    deleveryadress: { type: String },
    resivename : {type: String},
    tableid: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    food: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: { type: Number },
        discount: { type: Number },
        discountType: { type: String }
    }],
    systemdiscounts:{type: Number},
    discount: { type: Number },
    progressdata: { type: Date }
}, {
    timestamps: true
});
InvoiceSchema.pre('save', function (next) {
    // Get the current date and time
    const currentDate = new Date();

    // Set the progressdata field to the current date and time in UTC+03:00
    currentDate.setHours(currentDate.getHours() + 3);
    this.progressdata = currentDate;

    next();
});

const invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = invoice;
