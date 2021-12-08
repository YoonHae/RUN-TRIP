const  {s3} = require('.');
const {v4: uuidv4} = require('uuid');

function issueS3SecureKey(req, res) {
    
    const params = {
        Bucket: global.custom_env.AWS.s3.image.bucket,
        Key: uuidv4(),
        Expires: 60
    };

    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
            console.error('issue key error');
            console.error(err);
            res.json({success: false});
        } else {
            res.json({
                success: true,
                url: url
            });
        }
    });

}



module.exports = {issueS3SecureKey}