module.exports = app => {
    const ctrler = require("./controller");

    var router  = require('express').Router();

    router.get('/s3/securekey', ctrler.issueS3SecureKey);
    router.delete('/s3', ctrler.deleteS3Files);

    return router;
}