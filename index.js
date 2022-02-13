const config =  require('./config.js');
const express = require('express');
const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.set('view engine', 'pug')

const domains = require('./domain');
const checkout = require('./checkout');
const webhook = require('./webhook');
const customers = require('./customer');
app.use('/domains', domains);
app.use('/checkout', checkout);
app.use('/webhook', webhook);
app.use('/customers', customers);

console.log(`NODE_ENV=${config.NODE_ENV}`);

app.get('/', function (req, res) {
  res.render(
    'index', 
    { 
      title: 'Lease-A-Car', 
      message: 'Hello there!',
      purchase: 'Subscribe me some API',
    }
  );
})

app.listen(config.PORT, config.HOST, () => {
    console.log(`Running on http://${config.HOST}:${config.PORT}`);
});
