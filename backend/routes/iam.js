const express = require('express');
const { iamClient } = require('../aws-client');
const { ListUsersCommand, ListRolesCommand } = require('@aws-sdk/client-iam');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/users', async (req, res) => {
  try {
    const command = new ListUsersCommand({ MaxItems: 100 });
    const response = await iamClient.send(command);
    
    res.json({ users: response.Users || [] });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.get('/roles', async (req, res) => {
  try {
    const command = new ListRolesCommand({ MaxItems: 100 });
    const response = await iamClient.send(command);
    
    res.json({ roles: response.Roles || [] });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

module.exports = router;
