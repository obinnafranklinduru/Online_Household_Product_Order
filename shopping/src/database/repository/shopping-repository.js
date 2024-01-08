const { OrderModel, CartModel } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Dealing with database operations
class ShoppingRepository {
    
    // Retrieve orders for a customer
    async Orders(customerId){
        try {
            const orders = await OrderModel.find({ customerId });
            return orders;
        } catch (error) {
            throw new Error('Error retrieving orders');
        }
    }

    // Retrieve cart items for a customer
    async Cart(customerId){
        try {
            const cartItems = await CartModel.find({ customerId });
            if (cartItems) {
                return cartItems;
            }
            throw new Error('Cart data not found');
        } catch (error) {
            throw new Error('Error retrieving cart items');
        }
    }

    // Add or update a cart item
    async AddCartItem(customerId, item, qty, isRemove){
        try {
            const cart = await CartModel.findOne({ customerId });

            const { _id } = item;

            if (cart) {
                const cartItems = cart.items.filter(cartItem => {
                    if (cartItem.product._id.toString() === _id.toString() && !isRemove) {
                        cartItem.unit = qty;
                    }
                    return !isRemove || cartItem.product._id.toString() !== _id.toString();
                });

                if (!isRemove) {
                    cartItems.push({ product: { ...item }, unit: qty });
                }

                cart.items = cartItems;

                return await cart.save();
            } else {
                return await CartModel.create({
                    customerId,
                    items: [{ product: { ...item }, unit: qty }]
                });
            }
        } catch (error) {
            throw new Error('Error updating cart item');
        }
    }

    // Create a new order
    async CreateNewOrder(customerId, txnId) {
        try {
            const cart = await CartModel.findOne({ customerId });

            if (!cart) return {};

            let amount = 0;
            const cartItems = cart.items;

            let orderResult;

            if (cartItems.length > 0) {
                cartItems.forEach(item => {
                    amount += parseInt(item.product.price) * parseInt(item.unit);
                });

                const orderId = uuidv4();

                const order = new OrderModel({
                    orderId,
                    customerId,
                    amount,
                    status: 'received',
                    items: cartItems
                });

                cart.items = [];

                orderResult = await order.save();
                await cart.save();
            }

            return orderResult;
        } catch (error) {
            throw new Error('Error creating a new order');
        }
    }
}

module.exports = ShoppingRepository;