const aws = require('aws-sdk');
const s3  = new aws.S3({
    region: global.custom_env.AWS.region,
    accessKeyId: global.custom_env.AWS.s3.image.accessKeyId,
    secretAccessKey: global.custom_env.AWS.s3.image.secretAccessKey,
    signatureVersion: 'v4'
});


module.exports = {s3}