const httpStatus = require('http-status');

class AppError extends Error {
    constructor(
        name,
        statusCode,
        description,
        isOperational,
        errorStack,
        logingErrorResponse
    ) {
        super(description);
        Object.setPrototypeOf(this,new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
        Error.captureStackTrace(this);
    }
}

//api Specific Errors
class APIError extends AppError {
    constructor(
        name,
        statusCode = httpStatus.INTERNAL_SERVER_ERROR,
        description = 'Internal Server Error',
        isOperational = true
    )
    {
        super(name, statusCode, description, isOperational);
    }
}

//400
class BadRequestError extends AppError {
    constructor(
        description = 'Bad request',
        logingErrorResponse
    ) {
        super(
            'NOT FOUND',
            httpStatus.BAD_REQUEST,
            description,
            true,
            false,
            logingErrorResponse
        );
    } 
}

//400
class ValidationError extends AppError {
    constructor(
        description = 'Validation Error'
    ) {
        super(
            'BAD REQUEST',
            httpStatus.BAD_REQUEST,
            description,
            true
        );
    }
}


module.exports = {
    AppError,
    APIError,
    BadRequestError,
    ValidationError,
}