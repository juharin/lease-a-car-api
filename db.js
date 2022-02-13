// TODO: ADD DB
// Reverse mapping of stripe to API key. Model this in your preferred database.
const customers = {
  stripeCustomerId: {
    apiKey: '123xyz',
    active: false, 
    itemId: 'stripeSubscriptionItemId',
  },
};
const apiKeys = {
  '123xyz': 'stripeCustomerId',
};

module.exports = { customers, apiKeys };
