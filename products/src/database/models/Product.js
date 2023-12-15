const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    unit: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    available: {
        type: Boolean,
        default: true,
    },
    supplier: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('product', ProductSchema);
