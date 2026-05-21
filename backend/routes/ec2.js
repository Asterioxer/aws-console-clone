const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// In-memory mock state
let mockInstances = [
  {
    id: 'i-0abcd1234efgh5678',
    name: 'prod-web-server',
    state: 'running',
    type: 't3.medium',
    az: 'us-east-1a',
    publicIp: '54.123.45.67',
    launchTime: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: 'i-0wxyz9876lkjh5432',
    name: 'dev-database',
    state: 'stopped',
    type: 't2.micro',
    az: 'us-east-1b',
    publicIp: null,
    launchTime: new Date(Date.now() - 1728000000).toISOString()
  }
];

router.get('/instances', (req, res) => {
  res.json({ instances: mockInstances });
});

router.get('/instances/:id', (req, res) => {
  const instance = mockInstances.find(i => i.id === req.params.id);
  if (!instance) {
    return res.status(404).json({ error: 'Instance not found' });
  }
  res.json({ instance });
});

router.post('/instances/:id/start', (req, res) => {
  const instance = mockInstances.find(i => i.id === req.params.id);
  if (instance) {
    instance.state = 'running';
    instance.publicIp = `54.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
  res.json({ status: 'Starting', details: [ { InstanceId: req.params.id, CurrentState: { Name: 'pending' } } ] });
});

router.post('/instances/:id/stop', (req, res) => {
  const instance = mockInstances.find(i => i.id === req.params.id);
  if (instance) {
    instance.state = 'stopped';
    instance.publicIp = null;
  }
  res.json({ status: 'Stopping', details: [ { InstanceId: req.params.id, CurrentState: { Name: 'stopping' } } ] });
});

router.post('/instances/:id/reboot', (req, res) => {
  res.json({ status: 'Rebooting' });
});

module.exports = router;
