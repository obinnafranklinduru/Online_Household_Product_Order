const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    phone: { type: String, required: true },
    address: [
        { type: Schema.Types.ObjectId, ref: 'address' }
    ],
    cart: [
        {
            product: {
                _id: { type: String, required: true },
                name: { type: String, required: true },
                banner: { type: String },
                price: { type: Number, required: true },
            },
            unit: { type: Number, required: true }
        }
    ],
    wishlist: [
        {
            _id: { type: String, required: true },
            name: { type: String },
            description: { type: String },
            banner: { type: String },
            available: { type: Boolean, required: true },
            price: { type: Number, required: true },
        }
    ],
    orders: [
        {
            _id: { type: String, required: true },
            amount: { type: String, required: true },
            date: { type: Date, default: Date.now() }
        }
    ]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('customer', CustomerSchema);