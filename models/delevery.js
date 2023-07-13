const mongoose = require('mongoose');
const DeliverySchema = new mongoose.Schema({
    deliveryname: { type: String, require },
    deliverynumber: { type: String, require },
    invoice: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Invoice',
        customername : {type:String},
        location: { type: String },
        phoneNumber: { type: String },
        prgress : {type:String},
        finishdate : {type:String}
    }],
}, {
    timestamps: true
});
const Delevery = mongoose.model('Delivery', DeliverySchema);

module.exports = Delevery;
