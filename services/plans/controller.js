const { dbConnection } = require('.');
const { aDeleteS3Files } = require('../aws');
const query = require('./querystring');


function register(req, res) {
    // 필수값 체크
    for(var field of ['title', 'description', 'date', 'continent']){
        if(!req.body[field]) {
            return res.json({success: false, code: 501, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    }

    let plan = {
        user_id: req.user.id,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        images: req.body.images? req.body.images.join(";") : null,
        continent: req.body.continent
    }

    dbConnection.query(query.INSERT_PLAN, plan, function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, err });
        } else {
            return res.status(200).json({
                success: true
            });
        }
    });
}

async function getPlan(req, res) {
    let result = await dbConnection.aQuery(query.SELECT_PLAN_WHERE_ID, [req.params.id]);
    if(result.length) {
        let plan = result[0];
        if (plan.images) plan.images = plan.images.split(';');
        res.json({success: true, plan: plan})
    } else {
        res.json({success: false, message: '데이터가 없습니다.'})
    }
}

async function getPlanList(req, res) {
    let queryCondition = {
        order : req.body.order || "desc",       // sort direction
        sortBy : req.body.sortBy || "id",       // sort
        limit :  parseInt(req.body.limit||'20'),  // limit
        skip : parseInt(req.body.skip||'0'),  // offset
        where: ''
    }

    // where 조건
    let term = req.body.searchTerm;
    if(term)
    {
        queryCondition.where = `where title like '%${term} or description like '%${term}%'%'`
    }

    // 전체 개수
    let results = await dbConnection.aQuery(query.get_SELECT_PLAN_COUNT(queryCondition));
    let totalCnt = results[0].total_cnt;

    // 이번 데이터 조회
    results = await dbConnection.aQuery(query.get_SELECT_PLAN_LIST(queryCondition));
    for(var row of results) {
        if (row.images)
            row.images = row.images.split(';');
    }
    
    res.json({
        success: true, 
        plans: results, 
        postSize: Math.max(0, totalCnt-queryCondition.skip-queryCondition.limit)
    });
}


function updatePlan(req, res) {
    // 필수값 체크
    for(var field of ['title', 'description', 'date', 'continent']){
        if(!req.body[field]) {
            return res.json({success: false, code: 501, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    }

    if (!req.body.id) {
        return res.json({success: false, code: 501, message: '해당 글의 id 정보가 없습니다.'});
    }

    let plan = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        images: req.body.images? req.body.images.join(";") : null,
        continent: req.body.continent
    }

    dbConnection.query(query.UPDATE_PLAN, plan, function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, err });
        } else {
            return res.status(200).json({
                success: true
            });
        }
    });
}

async function deletePlan(req, res) {
    let result = await dbConnection.aQuery(query.SELECT_PLAN_WHERE_ID, [req.params.id]);
    if(result.length) {
        let plan = result[0];
        if (plan.images) 
        {
            plan.images = plan.images.split(';');
            await aDeleteS3Files(plan.images);

            result = await dbConnection.aQuery(query.DELETE_PLAN, [req.params.id]);
            res.json({success: true, result: result});
        }
    } else {
        res.json({success: true, result: 'empty data'});
    }
}


module.exports = {register, getPlanList, getPlan, updatePlan, deletePlan};