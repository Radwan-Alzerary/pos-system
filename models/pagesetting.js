const mongoose = require('mongoose');
const SettingSchema = new mongoose.Schema({
    shopname: {
        type: String,
    },
    shoplogo: {
        type: String
    },
    printerip: {
        type: String
    },
    adress: { type: String },
    phonnumber: { type: Number },
    deleverytable : { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }
}, {
    timestamps: true
});
const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
