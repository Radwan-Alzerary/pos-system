const mongoose = require('mongoose');
const SettingSchema = new mongoose.Schema({
    shopname: {
        type: String,
        default: ""
    },
    shoplogo: {
        type: String,
        default: ""

    },
    printerip: {
        type: String,
        default: ""

    },
    adress: {
        type: String,
        default: ""
    },

    phonnumber: {
        type: String,
        default: 0
    },
    dollarprice: { type: Number,
        default:"1"
    },
    deleverytable: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    invoicefooter : {type:String}
}, {
    timestamps: true
});
const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
