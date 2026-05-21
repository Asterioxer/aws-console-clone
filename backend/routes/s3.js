const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const mockBuckets = [
  { Name: 'awsconsole-assets', CreationDate: new Date('2023-01-01T00:00:00Z') },
  { Name: 'awsconsole-logs', CreationDate: new Date('2023-05-15T12:00:00Z') },
  { Name: 'awsconsole-backups', CreationDate: new Date('2024-02-10T08:30:00Z') }
];

const mockObjects = {
  'awsconsole-assets': [
    { Key: 'logo.png', Size: 10245, LastModified: new Date('2023-01-02T00:00:00Z') },
    { Key: 'styles.css', Size: 4500, LastModified: new Date('2023-01-03T00:00:00Z') }
  ],
  'awsconsole-logs': [
    { Key: 'access.log', Size: 1048576, LastModified: new Date() },
    { Key: 'error.log', Size: 5048, LastModified: new Date() }
  ],
  'awsconsole-backups': [
    { Key: 'db-backup.sql', Size: 50048576, LastModified: new Date('2024-02-11T00:00:00Z') }
  ]
};

router.get('/buckets', (req, res) => {
  res.json({ buckets: mockBuckets });
});

router.get('/buckets/:name/objects', (req, res) => {
  const objects = mockObjects[req.params.name] || [];
  res.json({ objects });
});

module.exports = router;
