const httpStatus = require('http-status');
const ShoppingService = require('../services/shopping-service');
const UserAuth = require('./middlewares/auth');
const { PublishMessage, SubscribeMessage } = require('../utils');
const { CUSTOMER_SERVICE } = require('../config');

module.exports = (app, channel) => {
    const service = new ShoppingService();

    SubscribeMessage(channel, service);

    app.post('/order', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { txnId } = req.body;

            const { data } = await service.PlaceOrder({ _id, txnId });

            console.log("payload", data)

            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');

            PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));

            res.status(httpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/orders', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetOrders(_id);
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.put('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.AddToCart(_id, req.body._id);
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/cart/:id', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.RemoveFromCart(_id, req.params.id);
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/cart', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetCart({ _id });
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/whoami', (req, res) => {
        res.status(httpStatus.OK).json({ msg: '/shopping: I am Shopping Service' });
    });
};