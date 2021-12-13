const  {s3, test, aDeleteS3Files} = require('.');
const {v4: uuidv4} = require('uuid');

function issueS3SecureKey(req, res) {
    
    const params = {
        Bucket: global.custom_env.AWS.s3.image.bucket,
        Key: uuidv4()
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

async function deleteS3Files(req, res) {
    const params = {
        Bucket: global.custom_env.AWS.s3.image.bucket,
        Key: uuidv4()
    };

    test('ggggggg');

    console.log(req.body);
    // url 로 key 추출
    let deleteKeys = []
    for(var url of req.body.deleteUrls)
    {
        deleteKeys.push(url.substr(url.lastIndexOf('/')+1));
    }

    try {
        // key 삭제 요청
        let result = await aDeleteS3Files(deleteKeys);
        res.json({success: result});
    }catch(error) {
        console.error(error);
        res.json({success: false});
    }
        
    
}






module.exports = {issueS3SecureKey, deleteS3Files}