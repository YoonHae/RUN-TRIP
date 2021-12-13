const aws = require('aws-sdk');
const s3  = new aws.S3({
    region: global.custom_env.AWS.region,
    accessKeyId: global.custom_env.AWS.s3.image.accessKeyId,
    secretAccessKey: global.custom_env.AWS.s3.image.secretAccessKey,
    signatureVersion: 'v4'
});


function aDeleteObject(params) {
    return new Promise((resolve, reject) => {
        s3.deleteObjects(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

async function aDeleteS3Files(keys) {
    let keyList = []
    if(!keys) return false;
    else if(typeof keys === 'string') keyList.push(keys);
    else if (Array.isArray(keys)) keyList = keys;
    else { // string 이나 array 가 아니면 예외
        throw Error("unknown type key data")
    }

    if (keyList.length > 0) {
        let params = {
            Bucket: global.custom_env.AWS.s3.image.bucket,
            Delete: {
                Objects: keyList.map((value) => {return {Key: value}})
            }
        }

        let deleteData = await aDeleteObject(params);
        return deleteData.Deleted.length > 0;   
    }
    return false;
}

function test (eco) {
    console.log('eco - ', eco);
}


module.exports = {s3, test, aDeleteS3Files}