const { EC2Client, RunInstancesCommand } = require('@aws-sdk/client-ec2');
const { S3Client, CreateBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { IAMClient, CreateUserCommand, CreateRoleCommand } = require('@aws-sdk/client-iam');

const config = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  },
  endpoint: 'http://127.0.0.1:4566',
  forcePathStyle: true // required for localstack S3
};

const ec2Client = new EC2Client(config);
const s3Client = new S3Client(config);
const iamClient = new IAMClient(config);

async function seed() {
  console.log('Seeding LocalStack with dummy data...');

  try {
    // Seed S3
    console.log('Creating S3 Buckets...');
    const buckets = ['awsconsole-assets', 'awsconsole-logs', 'awsconsole-backups'];
    for (const b of buckets) {
      await s3Client.send(new CreateBucketCommand({ Bucket: b }));
      // Add a dummy object
      await s3Client.send(new PutObjectCommand({
        Bucket: b,
        Key: 'hello.txt',
        Body: 'Hello World!'
      }));
    }
    console.log('S3 seeding done.');

    // Seed IAM
    console.log('Creating IAM Users & Roles...');
    await iamClient.send(new CreateUserCommand({ UserName: 'dev-user-1' }));
    await iamClient.send(new CreateUserCommand({ UserName: 'dev-user-2' }));
    
    await iamClient.send(new CreateRoleCommand({
      RoleName: 'EC2AccessRole',
      AssumeRolePolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'ec2.amazonaws.com' } }]
      })
    }));
    console.log('IAM seeding done.');

    // Seed EC2
    console.log('Creating EC2 Instances...');
    const res = await ec2Client.send(new RunInstancesCommand({
      ImageId: 'ami-0c55b159cbfafe1f0', // Dummy AMI
      InstanceType: 't2.micro',
      MinCount: 2,
      MaxCount: 2
    }));
    console.log(`EC2 seeding done. Created ${res.Instances?.length} instances.`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding LocalStack:', error);
  }
}

seed();
