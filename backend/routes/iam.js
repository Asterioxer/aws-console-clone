const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const mockUsers = [
  { UserName: 'dev-user-1', UserId: 'UID0001', CreateDate: new Date('2023-01-01T00:00:00Z') },
  { UserName: 'dev-user-2', UserId: 'UID0002', CreateDate: new Date('2023-02-15T00:00:00Z') },
  { UserName: 'admin-service', UserId: 'UID0003', CreateDate: new Date('2023-05-10T00:00:00Z') }
];

const mockRoles = [
  { RoleName: 'EC2AccessRole', RoleId: 'RID0001', CreateDate: new Date('2023-01-01T00:00:00Z') },
  { RoleName: 'LambdaExecutionRole', RoleId: 'RID0002', CreateDate: new Date('2023-04-20T00:00:00Z') }
];

router.get('/users', (req, res) => {
  res.json({ users: mockUsers });
});

router.get('/roles', (req, res) => {
  res.json({ roles: mockRoles });
});

module.exports = router;
