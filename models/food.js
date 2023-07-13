const mongoose = require('mongoose');
const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        url: { type: String }
    },
    active: {
        type: Boolean, default: true
    },
    unlimit: {
        type: Boolean, default: true
    },
    quantety: {
        type: Number, default: 0
    },
    addeduse: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, deleted: {
        type: Boolean, default: false
    }
}, {
    timestamps: true
});
const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;
