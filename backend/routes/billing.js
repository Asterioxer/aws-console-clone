const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/current', (req, res) => {
  // Return static mock billing data for the serverless demo
  res.json({
    total: {
      amount: '42.50',
      unit: 'USD'
    },
    services: [
      { name: 'Amazon Elastic Compute Cloud - Compute', amount: '25.00' },
      { name: 'Amazon Simple Storage Service', amount: '12.00' },
      { name: 'AWS Key Management Service', amount: '5.50' }
    ]
  });
});

module.exports = router;
