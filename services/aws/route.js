module.exports = app => {
    const ctrler = require("./controller");

    var router  = require('express').Router();

    router.get('/s3/securekey', ctrler.issueS3SecureKey);

    return router;
}