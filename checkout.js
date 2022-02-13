const config =  require('./config.js');
const stripe = require('stripe')(config.STRIPE_KEY);

let express = require('express');
let router = express.Router();

// Create a Stripe Checkout Session to create 
// a customer and subscribe them to a plan
router.post('/', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: config.PRICE_ITEM,
      },
    ],
    success_url: `http://${config.HOST}:${config.PORT}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://${config.HOST}:${config.PORT}/checkout/error`,
  });
  res.redirect(session.url);
});

router.get('/success', (req, res) => {
  const sessionId = req.query.session_id;
  res.render(
    'success', 
    { 
      title: 'Lease-A-Car', 
      message: 'Purchase complete!',
      subscription: 'You have successfully subscribed to API plan.',
      back_home: 'This way back home',
    }
  );
});

router.get('/error', (req, res) => {
  res.render(
    'error', 
    { 
      title: 'Lease-A-Car', 
      message: 'Well that didn\'t go so well...',
      back_home: 'This way back home',
    }
  );
});

module.exports = router;
