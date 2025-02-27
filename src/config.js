const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY
  },
  region: process.env.R2_REGION
});
