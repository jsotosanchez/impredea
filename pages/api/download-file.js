import aws from 'aws-sdk';
import { pipeline } from 'stream'
import zlib from 'zlib'

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
  });

  const fileKey = req.query['fileKey'];

  const s3 = new aws.S3();
  var options = {
    Bucket: `impredea-images`,
    Key: fileKey,
  };

  const fileSize = await sizeOf(options, s3)
  res.writeHead(200, {
    'Content-Type': req.headers['content-type'],
    'Content-Encoding': 'gzip',
    'Transfer-Encoding': 'chunked',
    'Content-Length': `${fileSize}`
  });
  var fileStream = s3.getObject(options).createReadStream();
  pipeline(fileStream, zlib.createGzip(), res, (err) => {
    res.end();
  })
}

function sizeOf(options, s3) {
  return s3.headObject(options)
    .promise()
    .then(res => res.ContentLength);
}