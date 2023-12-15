const httpStatus = require('http-status');
const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');
const { SubscribeMessage } = require('../utils');

module.exports = (app, channel) => {
    const service = new CustomerService();

    // Subscribe to messages using the channel and service
    SubscribeMessage(channel, service);

    // Route for user registration (sign up)
    app.post('/signup', async (req, res, next) => {
        try {
            const { email, password, phone } = req.body;
            const { data } = await service.SignUp({ email, password, phone });
            res.status(httpStatus.CREATED).json(data);
        } catch (error) {
            console.error('Error in /signup:', error);
            next(error);
        }
    });

    // Route for user login (sign in)
    app.post('/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { data } = await service.SignIn({ email, password });
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.error('Error in /login:', error);
            next(error);
        }
    });

    // Route for adding a new address (requires user authentication)
    app.post('/address', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { street, postalCode, city, country } = req.body;
            const { data } = await service.AddNewAddress(
                _id,
                { street, postalCode, city, country }
            );

            res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.error('Error in /address:', error);
            next(error);
        }
    });

    // Route for getting user profile (requires user authentication)
    app.get('/profile', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile({ _id });
            res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.error('Error in /profile:', error);
            next(error);
        }
    });

    // Route for getting shopping details (requires user authentication)
    app.get('/shopping-details', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetShoppingDetails(_id);
            return res.status(httpStatus.OK).json(data);
        } catch (error) {
            console.error('Error in /shopping-details:', error);
            next(error);
        }
    });

    // Route for getting user wishlist (requires user authentication)
    app.get('/wishlist', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetWishList(_id);
            return res.status(httpStatus.OK).status(200).json(data);
        } catch (error) {
            console.error('Error in /wishlist:', error);
            next(error);
        }
    });

    // Route for a simple 'whoami' message
    app.get('/whoami', (req, res, next) => {
        return res.status(httpStatus.OK).status(200).json({ msg: '/customer : I am Customer Service' });
    });
};