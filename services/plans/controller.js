const { dbConnection } = require('.');
const { aDeleteS3Files } = require('../aws');
const { getTokenInfo } = require('../users');
const query = require('./querystring');
const axios = require('axios');

const {getCachedPlanList, putCachedPlanList, deleteCachedPlanList} = require('./cache');


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
                success: true, id: results.insertId
            });
        }
    });
}


async function getPlanById(id, token) {
    let userInfo = await getTokenInfo(token);
    let result = null;
    if (!userInfo) userInfo = {id: null}
    result = await dbConnection.aQuery(query.SELECT_DETAIL_PLAN_WHERE_ID, {plan_id: id, user_id: userInfo.id});

    if(result.length) return result[0];
    else return null;
}


async function getPlan(req, res) {
    const plan = await getPlanById(req.params.id, req.cookies.w_auth);
    if(plan) {
        if (plan.images) plan.images = plan.images.split(';');
        res.json({success: true, plan: plan})
    } else {
        try {
            await deleteCachedPlanList(req.params.id);
        }catch(exception) {
            console.error(exception);
        }
        res.json({success: false, message: '데이터가 없습니다.'})
    }
}

async function getPlanList(req, res) {
    let queryCondition = {
        date1 : req.query.start_date || (new Date()).toISOString().replace('-', '').replace('-', '').substring(0, 8),
        date2 : req.query.end_date,
        continents : JSON.parse(req.query.continents || '[]'),  // 지역정보 array
        limit :  parseInt(req.query.limit||'20'),  // limit
        skip : parseInt(req.query.skip||'0'),  // offset
        useCache : req.query.cache || 't',  // 캐시 사용 여부
        term: req.query.searchTerm  // 검색용 글자
    }

    if (queryCondition.useCache === 't') 
    {
        try {
            // 캐시에서 데이터 조회
            const plans = await getCachedPlanList(queryCondition);
            res.json({ success: true, plans: plans, postSize: plans.length });
            return;  // 정상적으로 데이터 조회하면 return 하고 오류나면 아래 db 조회로직 실행
        } catch (exception) {
            console.error(exception);
        }
    }
    
    // where 조건
    
    if(queryCondition.term)
    {
        queryCondition.where = `where title like '%${queryCondition.term} or description like '%${queryCondition.term}%'%'`
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
    let plan = {}
    // UPDATE 컬럼 체크
    for(var field of ['title', 'description', 'date', 'continent', 'images']){
        if(req.body[field]) {
            plan[field] = req.body[field];
        }
    }

    let keys = Object.keys(plan);
    if (keys.length == 0) {
        return res.json({success: false, code: 501, message: `upload 할 항목이 없습니다.`,  data: req.body});
    }

    plan.id = req.params.id;
    if (plan.images) {
        plan.images = plan.images.join(";");
    }

    const sql = query.get_UPDATE_PLAN_BY_COLUMN_LIST(Object.keys(plan));
    dbConnection.query(sql, plan, async function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, err });
        } else {

            // caching
            const allPlan = await getPlanById(plan.id, req.cookies.w_auth);
            if(allPlan) {
                allPlan.images = allPlan.images.split(';');
                try {
                    await putCachedPlanList(allPlan);
                    console.log("update cache");
                }catch (exception)
                {
                    console.error(exception);
                }
                return res.status(200).json({
                    success: true
                });
            } else {
                return res.status(500).json({ success: false, err: "empty plan" });
            }
                        
        }
    });
}

async function deletePlan(req, res) {
    let result = await dbConnection.aQuery(query.SELECT_PLAN_WHERE_ID, [req.params.id]);
    if(result.length) {
        let plan = result[0];
        if (plan.images) 
        {
            try {
                // 메인 데이터 삭제 성공하면.
                result = await dbConnection.aQuery(query.DELETE_PLAN, [req.params.id]);
                if (result.affectedRows === 1) {
                    try {
                        // 캐시데이터 삭제
                        await deleteCachedPlanList(req.params.id);
                        console.log("delete cache");
                    } catch(innerException ){
                        console.error("delete cache fail -", innerException);
                    }

                    // s3이미지 데이터 삭제
                    plan.images = plan.images.split(';');
                    await aDeleteS3Files(plan.images);
                }
            }catch(exception) {
                console.error(exception);
            }

            res.json({success: true, result: result});
        }
    } else {
        res.json({success: true, result: 'empty data'});
    }
}


module.exports = {register, getPlanList, getPlan, updatePlan, deletePlan};