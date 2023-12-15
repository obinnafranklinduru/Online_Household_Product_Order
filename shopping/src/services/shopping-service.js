const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {

    constructor() {
        this.repository = new ShoppingRepository();
    }

    async GetCart({ _id }) {
        try {
            const cartItems = await this.repository.Cart(_id);
            return FormateData(cartItems);
        } catch (error) {
            throw new Error('Error getting cart items');
        }
    }

    async PlaceOrder(userInput) {
        try {
            const { _id, txnNumber } = userInput;
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
            return FormateData(orderResult);
        } catch (error) {
            throw new Error('Error placing order');
        }
    }

    async GetOrders(customerId) {
        try {
            const orders = await this.repository.Orders(customerId);
            return FormateData(orders);
        } catch (error) {
            throw new Error('Error getting orders');
        }
    }

    async GetOrderDetails({ _id, orderId }) {
        try {
            const orders = await this.repository.Orders(orderId);
            return FormateData(orders);
        } catch (error) {
            throw new Error('Error getting order details');
        }
    }

    async ManageCart(customerId, item, qty, isRemove) {
        try {
            const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
            return FormateData(cartResult);
        } catch (error) {
            throw new Error('Error managing cart');
        }
    }

    async SubscribeEvents(payload) {
        try {
            payload = JSON.parse(payload);
            const { event, data } = payload;
            const { userId, product, qty } = data;

            switch (event) {
                case 'ADD_TO_CART':
                    await this.ManageCart(userId, product, qty, false);
                    break;
                case 'REMOVE_FROM_CART':
                    await this.ManageCart(userId, product, qty, true);
                    break;
                default:
                    // Handle unknown events
                    throw new Error('Unknown event type');
            }
        } catch (error) {
            throw new Error('Error subscribing to events');
        }
    }

    async GetOrderPayload(userId, order, event) {
        try {
            if (order) {
                const payload = {
                    event: event,
                    data: { userId, order }
                };
                return payload;
            } else {
                return FormateData({ error: 'No Order Available' });
            }
        } catch (error) {
            throw new Error('Error getting order payload');
        }
    }
}

module.exports = ShoppingService;