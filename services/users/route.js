module.exports = app => {
    const users = require("./controller");

    var router  = require('express').Router();

    router.post('/register', users.register);
    router.post('/login', users.login);
    router.post('/logout', users.logout);
    router.get('/auth', users.auth);

    return router;
}