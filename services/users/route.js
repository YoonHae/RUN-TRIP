module.exports = app => {
    const users = require("./controller");

    var router  = require('express').Router();

    router.post('/register', users.register);
    router.post('/login', users.login);
    router.post('/logout', users._auth, users.logout);
    router.get('/auth', users._auth, users.auth);

    return router;
}