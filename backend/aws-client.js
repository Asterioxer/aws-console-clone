const { EC2Client } = require('@aws-sdk/client-ec2');
const { S3Client } = require('@aws-sdk/client-s3');
const { IAMClient } = require('@aws-sdk/client-iam');
const { CostExplorerClient } = require('@aws-sdk/client-cost-explorer');

const config = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
};

if (process.env.AWS_ENDPOINT_URL) {
  config.endpoint = process.env.AWS_ENDPOINT_URL;
  // LocalStack specifics
  config.forcePathStyle = true; // S3 specific setting for LocalStack
}

const ec2Client = new EC2Client(config);
const s3Client = new S3Client(config);
const iamClient = new IAMClient(config);
const ceClient = new CostExplorerClient(config);

module.exports = {
  ec2Client,
  s3Client,
  iamClient,
  ceClient
};
