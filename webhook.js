//const { app } = require('./index');
const config =  require('./config.js');
const stripe = require('stripe')(config.STRIPE_KEY);
const { customers, apiKeys } = require('./db');
const { generateAPIKey } = require('./api-keys');

let express = require('express');
let router = express.Router();

router.post('/', async (req, res) => {
  let data;
  let eventType;
  const webhookSecret = config.WEBHOOK;
  if (webhookSecret) {
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case 'checkout.session.completed':
      console.log(data);

      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;

      console.log(
        `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
      );

      // Get the subscription. The first item is the plan the user subscribed to.
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      // Generate API key
      const { apiKey, hashedAPIKey } = generateAPIKey();
      console.log(`User's API Key: ${apiKey}`);
      console.log(`Hashed API Key: ${hashedAPIKey}`);

      // Store the API key in your database.
      customers[customerId] = { apiKey: hashedAPIKey, itemId, active: true};
      apiKeys[hashedAPIKey] = customerId;

      console.log('[customers]', customers);
      console.log('[apiKeys]', apiKeys);

      break;
    case 'invoice.paid':
      break;
    case 'invoice.payment_failed':
      break;
    default:
  }

  res.sendStatus(200);
});

module.exports = router;
