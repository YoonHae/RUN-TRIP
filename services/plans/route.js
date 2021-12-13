module.exports = app => {
    const users = require("../users/controller");
    const plans = require('./controller');
    var router  = require('express').Router();

    router.get('/:id', plans.getPlan);
    router.get('/', plans.getPlanList);
    router.post('/', users._auth, plans.register);
    router.put('/:id', users._auth, plans.updatePlan);
    router.put('/:id/images', users._auth, plans.updatePlanImages);
    router.delete('/:id', users._auth, plans.deletePlan);
    

    return router;
}