module.exports = app => {
    const users = require("../users/controller");
    const history = require('./controller');
    var router  = require('express').Router();

    router.get('/', users._auth, history.getHistoryList);
    router.post('/', users._auth, history.register);
    router.delete('/:id', users._auth, history.deleteHistory);
    

    return router;
}