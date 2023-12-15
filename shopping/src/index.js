const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');

// Function to start the server
const StartServer = async () => {
    // Create an instance of Express
    const app = express();

    // Establish a connection to the database
    await databaseConnection();

    // Create a messaging channel- a communication link that allows different parts of
    // a distributed system to exchange messages.
    const channel = await CreateChannel();

    // Set up the Express application
    await expressApp(app, channel);

    // Start listening on the specified port
    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    })
        .on('error', (err) => {
            // Log and exit the process in case of an error
            console.error('Error starting the server:', err);
            process.exit(1); // Exit with a non-zero code to indicate an error
        })

    // Gracefully handle process termination signals
    process.on('SIGINT', () => {
        console.log('Received SIGINT. Closing server gracefully.');
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });

    process.on('SIGTERM', () => {
        console.log('Received SIGTERM. Closing server gracefully.');
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
    });
};

// Call the function to start the server
StartServer();