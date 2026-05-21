const express = require('express');
const { ec2Client } = require('../aws-client');
const { DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, RebootInstancesCommand } = require('@aws-sdk/client-ec2');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Helper to format instance data
const formatInstance = (inst) => {
  const nameTag = inst.Tags?.find(t => t.Key === 'Name')?.Value || 'Unnamed';
  return {
    id: inst.InstanceId,
    name: nameTag,
    state: inst.State?.Name,
    type: inst.InstanceType,
    az: inst.Placement?.AvailabilityZone,
    publicIp: inst.PublicIpAddress || null,
    launchTime: inst.LaunchTime
  };
};

router.get('/instances', async (req, res) => {
  try {
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);
    
    const instances = [];
    response.Reservations?.forEach(res => {
      res.Instances?.forEach(inst => {
        instances.push(formatInstance(inst));
      });
    });

    res.json({ instances });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.get('/instances/:id', async (req, res) => {
  try {
    const command = new DescribeInstancesCommand({ InstanceIds: [req.params.id] });
    const response = await ec2Client.send(command);
    
    const instance = response.Reservations?.[0]?.Instances?.[0];
    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }

    res.json({ instance: formatInstance(instance) });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.post('/instances/:id/start', async (req, res) => {
  try {
    const command = new StartInstancesCommand({ InstanceIds: [req.params.id] });
    const response = await ec2Client.send(command);
    res.json({ status: 'Starting', details: response.StartingInstances });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.post('/instances/:id/stop', async (req, res) => {
  try {
    const command = new StopInstancesCommand({ InstanceIds: [req.params.id] });
    const response = await ec2Client.send(command);
    res.json({ status: 'Stopping', details: response.StoppingInstances });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

router.post('/instances/:id/reboot', async (req, res) => {
  try {
    const command = new RebootInstancesCommand({ InstanceIds: [req.params.id] });
    await ec2Client.send(command);
    res.json({ status: 'Rebooting' });
  } catch (error) {
    res.status(500).json({ error: error.message, code: error.name });
  }
});

module.exports = router;
