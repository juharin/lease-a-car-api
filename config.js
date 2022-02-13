const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  STRIPE_KEY: process.env.STRIPE_KEY,
  WEBHOOK: process.env.WEBHOOK,
  PRICE_ITEM: process.env.PRICE_ITEM,
}
