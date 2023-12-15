const { createLogger, transports } = require('winston');
const { AppError } = require('./app-errors');

const logErrors = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'app_error.log' })
    ]
});

class ErrorLogger {
    constructor() {}

    async logError(err) {
        console.log('==================== Start Error Logger ===============');

        logErrors.log({
            private: true,
            level: 'error',
            message: `${new Date()}-${JSON.stringify(err)}`
        });

        console.log('==================== End Error Logger ===============');
        return false;
    }

    isTrustedError(error) {
        return error instanceof AppError && error.isOperational;
    }
}

const ErrorHandler = async (err, req, res, next) => {
    const errorLogger = new ErrorLogger();

    process.on('unhandledRejection', (reason, promise) => {
        console.log(reason, 'UNHANDLED');
        throw reason; // need to take care
    });

    process.on('uncaughtException', (err) => {
        errorLogger.logError(err);
        if (errorLogger.isOperationalError(err)) {
            // Process exit / restart
        }
    });

    if (err) {
        await errorLogger.logError(err);
        if (errorLogger.isOperationalError(err)) {
            if (err.errorStack) {
                const errorDescription = err.errorStack;
                return res.status(err.statusCode).json({ 'message': errorDescription });
            }
            return res.status(err.statusCode).json({ 'message': err.message });
        } else {
            // Process exit / restart
        }
        return res.status(err.statusCode).json({ 'message': err.message });
    }
    next();
};

module.exports = ErrorHandler;