//const { app } = require('./index');
const { customers } = require('./db');

let express = require('express');
let router = express.Router();

router.get('/:id/usage', async (req, res) => {
  const customerId = req.params.id;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
  });
  res.send(invoice);
});

router.get('/:id', (req, res) => {
  const customerId = req.params.id;
  const account = customers[customerId];
  if (account) {
    res.send(account);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
