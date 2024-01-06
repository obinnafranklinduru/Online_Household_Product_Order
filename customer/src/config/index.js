require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  INFO_NAME: process.env.INFO_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  CUSTOMER_SERVICE: process.env.CUSTOMER_SERVICE,
  SHOPPING_SERVICE: process.env.SHOPPING_SERVICE,
};