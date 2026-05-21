require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const ec2Routes = require('./routes/ec2');
const s3Routes = require('./routes/s3');
const iamRoutes = require('./routes/iam');
const billingRoutes = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ec2', ec2Routes);
app.use('/api/s3', s3Routes);
app.use('/api/iam', iamRoutes);
app.use('/api/billing', billingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
