const httpStatus = require('http-status');
const { ValidateSignature } = require('../../utils');

/**
 * Middleware to validate request signature.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
module.exports = async (req, res, next) => {
    try {
        // Validate request signature
        const isAuthorized = await ValidateSignature(req);

        if (isAuthorized) {
            // If authorized, proceed to the next middleware or route handler
            return next();
        } else {
            // If not authorized, send a 403 Forbidden response
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not Authorized' });
        }
    } catch (error) {
        // Handle errors that might occur during the signature validation
        console.error('Error in ValidateSignature middleware:', error);
        next(error);
    }
};