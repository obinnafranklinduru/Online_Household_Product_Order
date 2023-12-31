const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");

const {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
} = require("../config");

// Utility functions

/**
 * Generate a random salt for password hashing.
 * @returns {Promise<string>} - Generated salt.
 */
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

/**
 * Generate a hashed password using a given password and salt.
 * @param {string} password - Plain text password.
 * @param {string} salt - Salt for password hashing.
 * @returns {Promise<string>} - Hashed password.
 */
module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

/**
 * Validate entered password against a saved password using the provided salt.
 * @param {string} enteredPassword - Entered plain text password.
 * @param {string} savedPassword - Saved hashed password.
 * @param {string} salt - Salt used for password hashing.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

/**
 * Generate a JWT token with the given payload.
 * @param {Object} payload - Data to be included in the token.
 * @returns {Promise<string>} - JWT token.
 */
module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "3d" });
  } catch (error) {
    console.error('Error generating signature:', error);
    throw error;
  }
};

/**
 * Validate JWT signature from the request headers.
 * @param {Object} req - Express request object.
 * @returns {Promise<boolean>} - True if the signature is valid, false otherwise.
 */
module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");

    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);

    req.user = payload;
    return true;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
};

/**
 * Format data into a standardized structure.
 * @param {*} data - Data to be formatted.
 * @returns {Object} - Formatted data object.
 * @throws Will throw an error if data is falsy.
 */
module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data not found!");
  }
};

// Message Broker

/**
 * Create a message broker channel.
 * @returns {Promise<amqplib.Channel>} - Created message broker channel.
 * @throws Will throw an error if the connection or channel creation fails.
 */
module.exports.CreateChannel = async () => {
  try {
    // Establishing a connection to the message queue server
    const connection = await amqplib.connect(MSG_QUEUE_URL);

    // Creating a channel for communication with the AMQP server
    const channel = await connection.createChannel();

    // Asserting the existence of a queue with specified properties
    // (direct exchange, durability - messages survive server restarts) for message routing
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });

    // Returning the created channel for further use
    return channel
  } catch (err) {
    console.error('Error creating channel:', err);
    throw new Error(err.message);
  }
};

/**
 * Publish a message to the message broker channel.
 * @param {amqplib.Channel} channel - Message broker channel.
 * @param {string} service - Service name.
 * @param {string} msg - Message content.
 */
module.exports.PublishMessage = (channel, service, msg) => {
  try {
    // Publishing the message to the specified exchange with the given routing key
    channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent:", msg);
  } catch (err) {
    console.error('Error publishing message:', err.message);
  }
};
