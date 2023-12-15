const httpStatus = require('http-status');
const CustomerService = require("../services/customer-service");

module.exports = (app) => {
    const service = new CustomerService();

    /**
     * Middleware to handle incoming app events.
     * This middleware assumes that the incoming request body contains a 'payload' property.
     */
    app.post('/app-events', async (req, res, next) => {
        try {
            const { payload } = req.body;

            // Handle subscribe events using the customer service
            service.SubscribeEvents(payload);

            console.log("============= Shopping ================");
            console.log(payload);

            // Send a JSON response with the processed payload
            res.json(payload);
        } catch (error) {
            // Log any errors that occur during event handling
            console.error("Error handling app event:", error);
            
            // Send an error response
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    });
};
