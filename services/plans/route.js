module.exports = app => {
    const users = require("../users/controller");
    const plans = require('./controller');
    var router  = require('express').Router();

    router.get('/:id', plans.getPlan);
    router.get('/', plans.getPlanList);
    router.post('/', users._auth, plans.register);
    

    return router;
}