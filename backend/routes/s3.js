const express = require('express');
const { s3Client } = require('../aws-client');
const { ListBucketsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/buckets', async (req, res) => {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    res.json({ buckets: response.Buckets || [] });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.get('/buckets/:name/objects', async (req, res) => {
  try {
    const command = new ListObjectsV2Command({ 
      Bucket: req.params.name,
      MaxKeys: 100
    });
    const response = await s3Client.send(command);
    
    res.json({ objects: response.Contents || [] });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

module.exports = router;
