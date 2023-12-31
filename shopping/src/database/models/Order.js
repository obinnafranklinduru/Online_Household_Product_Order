const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderId: { type: String },
    customerId: { type: String },
    amount: { type: Number },
    status: { type: String, default: 'pending' },
    items: [
        {   
            product: {
                _id: { type: String, required: true },
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                supplier: { type: String },
            } ,
            unit: { type: Number, required: true } 
        }
    ]
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);