const config =  require('./config.js');
const stripe = require('stripe')(config.STRIPE_KEY);
const { customers, apiKeys } = require('./db');
const { hashAPIKey } = require('./api-keys');

let express = require('express');
let router = express.Router();

router.get('/', async (req, res) => {
  //const apiKey = req.header('X-Api-Key');
  const { apiKey } = req.query;
  if (!apiKey) {
    res.sendStatus(400); // Bad Request
  }

  const hashedAPIKey = hashAPIKey(apiKey);
  const customerId = apiKeys[hashedAPIKey];
  const customer = customers[customerId];

  if (!customer || !customer.active) {
    res.sendStatus(403); // Not Authorized
  } else {
    // Record usage with Stripe Billing
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: 'now',
        action: 'increment',
      }
    );
    res.send({ data: '🔥🔥🔥🔥🔥🔥🔥🔥', usage: record });
  }
});

module.exports = router;
