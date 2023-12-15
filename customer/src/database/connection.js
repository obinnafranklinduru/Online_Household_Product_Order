const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
    try {
        await mongoose.connect(DB_URL);

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};